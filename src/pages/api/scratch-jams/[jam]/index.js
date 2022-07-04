import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJam, isScratchJamOrganizer, updateScratchJam, deleteScratchJam } from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const slug = req.query.jam;
    const client = await clientPromise;
    const Database = client.db();

    const isAdmin = (await getUserData(Database, req.session?.user?.name))?.admin;
    const isOrganizer = await isScratchJamOrganizer(Database, slug, req.session?.user?.name);

    const jam = await getScratchGameJam(Database, slug, req.session?.user?.name);
    if (jam.meta?.archived === true && !isAdmin)
        return res.status(403).json({ error: { identifier: 'insufficientPermissions', message: 'You do not have permission to access archived game jams. Only administrators can do that.' } });

    switch (req.method) {
        case 'GET': {
            // Retrieves the details of the requested game jam
            const jam = await getScratchGameJam(Database, slug, req.session?.user?.name);

            return jam ? res.status(200).json(jam) : res.status(404).json({ error: { identifier: 'notFound', message: 'Not found' } });
        }
        case 'PUT': {
            let body = req.body;
            if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body' } });
            if (!isObject(body)) body = JSON.parse(body);
            if ((!isOrganizer && !isAdmin) || (body.hasOwnProperty('meta.featured') && !isAdmin)) return res.status(403).json({ error: 'Insufficient permissions' });

            try {
                await updateScratchJam(Database, slug, { ...body });
            } catch (error) {
                return res.status(400).json({ error });
            }
            return res.status(200).json({ success: true });
        }
        case 'DELETE': {
            if (!isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

            try {
                await deleteScratchJam(Database, slug);
            } catch (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({ success: true });
        }
        default: {
            res.status(405).json({ error: 'Method not allowed' });
            break;
        }
    }
}, sessionOptions);
