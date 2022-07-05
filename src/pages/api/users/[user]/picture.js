import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { user } = req.query;

    let userData = await fetch(`https://api.scratch.mit.edu/users/${user}/`).catch((e) => {
        return res.status(500).json({ error: { identifier: 'unknownError', message: 'The server was not able to handle this request', details: e } });
    });
    userData = await userData.json();

    return res.redirect(`https://cdn2.scratch.mit.edu/get_image/user/${userData.id}_200x200.png`);
}, sessionOptions);
