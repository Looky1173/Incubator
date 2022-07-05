import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJam, isScratchJamOrganizer, archiveScratchJam } from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const client = await clientPromise;
    const Database = client.db();

    const isAdmin = (await getUserData(Database, req.session?.user?.name))?.admin;
    const isOrganizer = await isScratchJamOrganizer(Database, jam, req.session?.user?.name);

    const jam = await getScratchGameJam(Database, jam, req.session?.user?.name);

    if (req.method === 'GET') {
        let body = req.body;
        if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with archived state' } });
        if (!isObject(body)) body = JSON.parse(body);
        if (body.archived !== true && body.archived !== false) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing archived state' } });
        if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

        try {
            await archiveScratchJam(Database, jam, body.archived);
        } catch (error) {
            return res.status(400).json({ error });
        }
        return res.status(200).json({ success: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
