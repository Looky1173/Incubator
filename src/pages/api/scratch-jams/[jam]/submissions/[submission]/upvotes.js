import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import {
    getScratchGameJamSubmissionUpvotes,
    saveScratchGameJamSubmissionUpvote,
    removeScratchGameJamSubmissionUpvote,
} from '@database/scratch-jams';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam, submission } = req.query;
    const client = await clientPromise;
    const Database = client.db();

    switch(req.method) {
        case 'GET': {
            const upvotes = await getScratchGameJamSubmissionUpvotes(Database, jam, submission, req.session?.user?.name);
            return res.status(200).json(upvotes);
        };
        case 'POST': {
            try {
                await saveScratchGameJamSubmissionUpvote(Database, jam, submission, req.session.user.name);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(error.identifier === 'notFound' ? 400 : 403).json({ error });
            }
        };
        case 'DELETE': {
            try {
                await removeScratchGameJamSubmissionUpvote(Database, jam, submission, req.session.user.name);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(400).json({ error: error });
            }
        };
        default: {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    }
}, sessionOptions);
