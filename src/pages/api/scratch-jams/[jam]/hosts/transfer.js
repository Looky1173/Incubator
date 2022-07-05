import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { isScratchJamOrganizer, makeScratchJamOrganizer } from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const client = await clientPromise;
    const Database = client.db();

    const isAdmin = (await getUserData(Database, req.session?.user?.name))?.admin;
    const isOrganizer = await isScratchJamOrganizer(Database, jam, req.session?.user?.name);

    if (req.method === 'PUT') {
        let body = req.body;
        if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
        if (!isObject(body)) body = JSON.parse(body);
        if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
        const isNewHostAnOrganizer = await isScratchJamOrganizer(Database, jam, body.username);
        if (isNewHostAnOrganizer === null) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host does not exist' } });
        if (isNewHostAnOrganizer === true) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host is already the organizer' } });
        if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

        await makeScratchJamOrganizer(Database, jam, body.username);
        return res.status(200).json({ success: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
