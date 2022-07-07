import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getUserData } from '@database/users';

export default withIronSessionApiRoute(async (req, res) => {
    const websiteURL = process.env.WEBSITE_URL;
    let redirect = `${websiteURL.replace(/(^\w+:|^)\/\//, '')}/api/auth/handle`;
    redirect = Buffer.from(redirect).toString('base64');

    if (!req.session.user) {
        // No valid session was found
        res.redirect(`https://auth.itinerary.eu.org/auth/?redirect=${redirect}&name=Incubator`);
    } else {
        // The user is already logged in, or have sent a session cookie
        let userData = await getUserData(req.session.user.name);
        if (!userData) {
            req.session.destroy();
            return res.redirect(`https://fluffyscratch.hampton.pw/auth/getKeys/v2?redirect=${redirect}`);
        }

        res.redirect(websiteURL);
    }
}, sessionOptions);
