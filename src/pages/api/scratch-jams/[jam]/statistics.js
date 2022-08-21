import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { getScratchGameJamStatistics } from '@database/scratch-jams';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { jam } = req.query;

    const statistics = await getScratchGameJamStatistics(jam, req.session?.user?.name);
    return res.status(200).json(statistics);
}, sessionOptions);
