import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getUserData, deleteUser } from '@database/users';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const client = await clientPromise;
    const Database = client.db();

    const { user } = req.query;

    if (req.method === 'DELETE') {
        if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });

        let userData = await getUserData(Database, req.session.user.username);
        if (!userData) return res.status(403).json({ error: 'Invalid session' });

        if (userData.admin !== true && user.toLowerCase() !== userData.name.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await deleteUser(Database, user);

        return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
