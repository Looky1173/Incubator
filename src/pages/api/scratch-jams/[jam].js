import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJam } from '@database/scratch-jams';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const client = await clientPromise;
    const Database = client.db();

    if (req.method === 'GET') {
        let jam = await getScratchGameJam(Database, req.query.jam);

        return res.status(200).json(jam);
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
