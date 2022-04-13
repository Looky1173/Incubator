import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJams } from '@database/scratch-jams';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const client = await clientPromise;
    const Database = client.db();

    if (req.method === 'GET') {
        let jams = await getScratchGameJams(Database, req.query.limit, req.query.offset);

        return res.status(200).json(jams);
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
