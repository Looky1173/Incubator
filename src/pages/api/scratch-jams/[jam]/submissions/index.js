import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import {
    getScratchGameJamSubmissions,
    saveScratchGameJamSubmission,
} from '@database/scratch-jams';

import clientPromise from '@database';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const client = await clientPromise;
    const Database = client.db();

    switch(req.method) {
        case 'GET': {
            const submissions = await getScratchGameJamSubmissions(Database, jam, { limit: req.query.limit, offset: req.query.offset, sort: req.query.sort });
            return res.status(200).json(submissions);
        };
        case 'POST': {
            let body = req.body;
            if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with project ID' } });
            if (!isObject(body)) body = JSON.parse(body);
            if (!body.projectId) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing project ID' } });

            try {
                await saveScratchGameJamSubmission(Database, jam, body.projectId, req.session.user.name);
            } catch (error) {
                console.log(error);
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({ success: true });
        }
        default: {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    }
}, sessionOptions);