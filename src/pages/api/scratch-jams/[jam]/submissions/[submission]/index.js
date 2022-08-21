import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { isScratchJamOrganizer, getScratchGameJamSubmission, getScratchGameJamStatistics, removeScratchGameJamSubmission, ensureArchivedJamIntegrity } from '@database/scratch-jams';
import { getUserData } from '@database/users';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam, submission } = req.query;
    const method = req.method;

    await ensureArchivedJamIntegrity(req, res, jam);

    if (method == 'GET') {
        const _submission = await getScratchGameJamSubmission(jam, submission);
        return _submission ? res.status(200).json(_submission) : res.status(404).json({ error: { identifier: 'notFound', message: 'The requested submission could not be found' } });
    }

    if (method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    const isAdmin = (await getUserData(req.session.user.name)).admin;
    const isOrganizer = await isScratchJamOrganizer(jam, req.session.user.name);

    const statistics = await getScratchGameJamStatistics(jam, req.session.user.name);
    const removingOwnSubmissions = statistics.participation.project === submission;
    const canRemoveSubmission = removingOwnSubmissions || isAdmin || isOrganizer !== null;

    if (!canRemoveSubmission) return res.status(403).json({ error: 'Insufficient permissions' });

    try {
        await removeScratchGameJamSubmission(jam, submission);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({ error: error });
    }
}, sessionOptions);
