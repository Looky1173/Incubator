import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'GET') res.status(405).json({ error: 'Method not allowed' });

    const { jam } = req.query;

    return res.status(200).json({ jam: jam, session: req.session });
}, sessionOptions);
