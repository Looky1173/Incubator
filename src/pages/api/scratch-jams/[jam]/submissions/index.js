import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { getScratchGameJamSubmissions, saveScratchGameJamSubmission, ensureArchivedJamIntegrity } from '@database/scratch-jams';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const method = req.method;

    await ensureArchivedJamIntegrity(req, res, jam);

    if (method == 'GET') {
        // Retrieves the submissions of the requested game jam
        const submissions = await getScratchGameJamSubmissions(jam, { limit: req.query.limit, offset: req.query.offset, sort: req.query.sort });
        return res.status(200).json(submissions);
    }

    if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    // Inserts a new submission into the database
    let body = req.body;
    if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with project ID' } });
    if (!isObject(body)) body = JSON.parse(body);
    if (!body.projectId) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing project ID' } });

    try {
        await saveScratchGameJamSubmission(jam, body.projectId, req.session.user.name);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error });
    }
    return res.status(200).json({ success: true });
}, sessionOptions);
