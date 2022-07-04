import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJamSubmission, getScratchGameJamStatistics, removeScratchGameJamSubmission } from '@database/scratch-jams';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam, submission: submissionId } = req.query;
    const client = await clientPromise;
    const Database = client.db();

    switch (req.method) {
        case 'GET': {
            const submission = await getScratchGameJamSubmission(Database, jam, submissionId);
            return submission ? res.status(200).json(submission) : res.status(404).json({ error: { identifier: 'notFound', message: 'The requested submission could not be found' } });
        }
        case 'DELETE': {
            const statistics = await getScratchGameJamStatistics(Database, jam, req.session.user.name);
            const removingOwnSubmissions = statistics.participation.project === submissionId;
            const canRemoveSubmission = removingOwnSubmissions || isAdmin || isOrganizer !== null;

            if (!canRemoveSubmission) return res.status(403).json({ error: 'Insufficient permissions' });

            try {
                await removeScratchGameJamSubmission(Database, jam, submissionId);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(400).json({ error });
            }
        }
        default: {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    }
}, sessionOptions);
