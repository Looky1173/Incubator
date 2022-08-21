import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { changeScratchJamThumbnail, isScratchJamOrganizer, ensureArchivedJamIntegrity } from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const method = req.method;

    await ensureArchivedJamIntegrity(req, res, jam);

    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    const isAdmin = (await getUserData(req.session.user.name)).admin;
    const isOrganizer = await isScratchJamOrganizer(jam, req.session.user.name);

    if (method === 'PUT') {
        let body = req.body;
        if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with thumbnail URL' } });
        if (!isObject(body)) body = JSON.parse(body);
        if (!body.thumbnailURL) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing thumbnail URL' } });
        if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

        await changeScratchJamThumbnail(jam, body.thumbnailURL);
        return res.status(200).json({ success: true });
    } else if (method === 'DELETE') {
        // Removes the current thumbnail
        if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

        await changeScratchJamThumbnail(jam, null);
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
