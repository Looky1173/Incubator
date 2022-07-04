import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import {
    isScratchJamOrganizer,
    changeScratchJamThumbnail
} from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const client = await clientPromise;
    const Database = client.db();

    const isAdmin = (await getUserData(Database, req.session?.user?.name))?.admin;
    const isOrganizer = await isScratchJamOrganizer(Database, jam, req.session?.user?.name);

    switch(req.method) {
        case 'GET': {
            let body = req.body;
            if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with thumbnail URL' } });
            if (!isObject(body)) body = JSON.parse(body);
            if (!body.thumbnailURL) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing thumbnail URL' } });
            if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

            await changeScratchJamThumbnail(Database, jam, body.thumbnailURL);
            return res.status(200).json({ success: true });
        };
        case 'DELETE': {
            // Removes the current thumbnail
            if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

            await changeScratchJamThumbnail(Database, jam, null);
            return res.status(200).json({ success: true });
        };
        default: {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    }    
}, sessionOptions);
