import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

export default withIronSessionApiRoute(async (req, res) => {
    req.session.destroy();
    res.json({ isLoggedIn: false });
}, sessionOptions);
