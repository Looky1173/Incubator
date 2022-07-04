import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJamStatistics } from '@database/scratch-jams';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const slug = req.query.jam;
    const client = await clientPromise;
    const Database = client.db();

    if (req.method === 'GET') {
        const statistics = await getScratchGameJamStatistics(Database, slug, req.session?.user?.name);
        return res.status(200).json(statistics);
    }
    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
