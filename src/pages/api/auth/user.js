import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getUserData } from '@database/users';

import clientPromise from '@database';

export default withIronSessionApiRoute(userRoute, sessionOptions);

async function userRoute(req, res) {
    const client = await clientPromise;
    const Database = client.db();

    if (req.method === 'GET') {
        if (req.session.user) {
            let user = await getUserData(Database, req.session.user.username);
            if (!user) return res.json({ isLoggedIn: false });

            let scratchResponse = await fetch(`https://api.scratch.mit.edu/users/${req.session.user.username}/`);
            let scratchData = await scratchResponse.json();
            let pictureURL = 'https://cdn2.scratch.mit.edu/get_image/user/0_90x90.png';
            if (scratchData.profile) pictureURL = scratchData.profile.images['90x90'];

            return res.json({
                ...req.session.user,
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
