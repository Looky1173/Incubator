import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getUserData } from '@database/users';

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req, res) {
    if (req.method === 'GET') {
        if (req.session.user) {
            let user = await getUserData(req.session.user.name);
            if (!user) return res.json({ isLoggedIn: false });

            let scratchResponse = await fetch(`https://api.scratch.mit.edu/users/${req.session.user.name}/`);
            let scratchData = await scratchResponse.json();
            let pictureURL = 'https://cdn2.scratch.mit.edu/get_image/user/0_90x90.png';
            if (scratchData.profile) pictureURL = scratchData.profile.images['90x90'];

            return res.json({
                ...user,
                profilePicture: pictureURL,
                isLoggedIn: true,
            });
        } else {
            return res.json({
                isLoggedIn: false,
            });
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}
