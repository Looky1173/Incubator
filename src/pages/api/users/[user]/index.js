import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getUserData, deleteUser } from '@database/users';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
    if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });

    const { user } = req.query;

    let userData = await getUserData(req.session.user.name);
    if (!userData) return res.status(403).json({ error: 'Invalid session' });

    if (userData.admin !== true && user.toLowerCase() !== userData.name.toLowerCase()) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    await deleteUser(user);

    return res.status(200).json({ success: true });
}, sessionOptions);
