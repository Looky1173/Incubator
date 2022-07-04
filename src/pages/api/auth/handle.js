import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getUserData, createUser } from '@database/users';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const client = await clientPromise;
    const Database = client.db();

    // The user is back from Hampton's authentication service
    const privateCode = req.query.privateCode;
    const websiteURL = process.env.WEBSITE_URL;

    let authResponse = await fetch('https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=' + privateCode).catch((e) => {
        console.log(e);
        return res.redirect(`${websiteURL}/?auth-error=1`);
    });

    let authData = await authResponse.json();

    if (authData.valid) {
        // Get the proper case of the username instead of URL case

        let scratchResponse = await fetch(`https://api.scratch.mit.edu/users/${authData.username}/`).catch((e) => {
            console.log(e);
            return res.redirect(`${websiteURL}/?auth-error=1`);
        });
        let scratchData = await scratchResponse.json();

        if (!scratchData.username) {
            return res.json({ error: { status: 404, code: 'userNotFound', detail: 'This user could not be found on Scratch.' } });
        }

        let user = await getUserData(Database, scratchData.username);
        if (!user) {
            let now = new Date();
            await createUser(Database, {
                name: scratchData.username,
                meta: {
                    updated: now.toISOString(),
                    updatedBy: null,
                },
            });

            req.session.user = { name: scratchData.username };
            await req.session.save();
            return res.redirect(websiteURL);
        }

        if (user.banned) res.redirect(`${websiteURL}/?auth-error=2`);

        // The user is now logged in
        req.session.user = user;
        await req.session.save();
        res.redirect(websiteURL);
    } else {
        // Failed FluffyScratch auth
        res.redirect(`${websiteURL}/?auth-error=0`);
    }
}, sessionOptions);
