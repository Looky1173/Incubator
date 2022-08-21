import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { getScratchGameJamSubmissionFeedback, saveScratchGameJamSubmissionFeedback, getScratchGameJamSubmission, isScratchJamOrganizer, ensureArchivedJamIntegrity } from '@database/scratch-jams';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam, submission } = req.query;
    const method = req.method;

    await ensureArchivedJamIntegrity(req, res, jam);

    const feedback = await getScratchGameJamSubmissionFeedback(jam, submission);

    if (method === 'GET') return res.status(200).json(feedback);

    if (method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });
    const username = req.session.user.name;
    const isOrganizer = await isScratchJamOrganizer(jam, username);
    if (isOrganizer === null) return res.status(403).json({ error: 'Insufficient permissions' });

    let body = req.body;
    if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with feedback data' } });
    if (!isObject(body)) body = JSON.parse(body);
    const feedbackData = body.feedback;

    // Prepare the array of feedback objects that will be inserted into the database,
    // including all feedback not written by the current user
    let updatedFeedback = feedback.filter((feedback) => feedback.author !== username);

    // Find all the previous feedback left by the user
    // and get an array of comment ids
    const previousFeedback = feedback.filter((feedback) => feedback.author === username).map((feedback) => feedback.comment);

    let feedbackToBeVerified = [];

    // Compare the previous feedback to the new feedback
    feedbackData.forEach((comment) => {
        if (previousFeedback.includes(comment)) {
            // If the previous array of feedback contains a value from the new array,
            // push it to the array of feedback objects to be saved to the database,
            // as it has not been touched by the user (they have not deselected it)
            updatedFeedback.push({ author: username, comment: comment });
        } else {
            // Since the current comment id is not present amongst previous feedback,
            // add it to `feedbackToBeVerified` to check if the current user really is the comment's poster
            feedbackToBeVerified.push(comment);
        }
        // Feedback that is included in `previousFeedback` but not in `feedbackData` can be considered deleted,
        // and will never make it to `updatedFeedback` because we are iterating over `feedbackData`
    });

    if (feedbackToBeVerified.length > 5) return res.status(400).json({ error: { identifier: 'tooManyFeedback', message: 'You cannot add more than 5 pieces of feedback at a time' } });

    const submissionData = await getScratchGameJamSubmission(jam, submission);
    const submissionAuthor = submissionData?.author;

    const feedbackAuthors = await Promise.all(
        feedbackToBeVerified.map((comment) =>
            fetch(`https://api.scratch.mit.edu/users/${submissionAuthor}/projects/${submission}/comments/${comment}`)
                .then((res) => res.json())
                .catch((e) => console.log(e)),
        ),
    );

    // Loop over `feedbackAuthors` and add all feedback written by the current user to `updatedFeedback`
    feedbackAuthors.forEach((comment) => {
        if (comment?.author?.username === username) updatedFeedback.push({ author: username, comment: comment.id });
    });

    // Sort `updatedFeedback` by newest
    updatedFeedback.sort((a, b) => b.comment - a.comment);

    // Save `updatedFeedback`
    try {
        await saveScratchGameJamSubmissionFeedback(jam, submission, updatedFeedback);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}, sessionOptions);
