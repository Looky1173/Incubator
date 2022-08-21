import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { getScratchGameJamSubmissionUpvotes, saveScratchGameJamSubmissionUpvote, removeScratchGameJamSubmissionUpvote, ensureArchivedJamIntegrity } from '@database/scratch-jams';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam, submission } = req.query;
    const method = req.method;

    await ensureArchivedJamIntegrity(req, res, jam);

    if (method === 'GET') {
        const upvotes = await getScratchGameJamSubmissionUpvotes(jam, submission, req.session?.user?.name);
        return res.status(200).json(upvotes);
    }

    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    if (method === 'POST') {
        try {
            await saveScratchGameJamSubmissionUpvote(jam, submission, req.session.user.name);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(error.identifier === 'notFound' ? 400 : 403).json({ error: error });
        }
    } else if (method === 'DELETE') {
        try {
            await removeScratchGameJamSubmissionUpvote(jam, submission, req.session.user.name);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
