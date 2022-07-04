import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getUserData, deleteUser } from '@database/users';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const slug = req.query.user;
    const client = await clientPromise;
    const Database = client.db();

    if (req.method === 'DELETE') {
        if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });

        let userData = await getUserData(Database, req.session.user.name);
        if (!userData) return res.status(403).json({ error: 'Invalid session' });

        if (userData.admin !== true && slug[0].toLowerCase() !== userData.name.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await deleteUser(Database, slug[0]);

        return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
