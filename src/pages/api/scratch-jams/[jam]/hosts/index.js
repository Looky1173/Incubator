import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJamHosts, isScratchJamOrganizer } from '@database/scratch-jams';
import { isObjectEmpty, isObject } from '@utils/object';
import { getUserData } from '@database/users';
import clientPromise from '@database';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const client = await clientPromise;
    const Database = client.db();

    const isOrganizer = await isScratchJamOrganizer(Database, jam, req.session?.user?.name);
    const isAdmin = (await getUserData(Database, req.session?.user?.name))?.admin;

    switch (req.method) {
        case 'GET': {
            const hosts = (await getScratchGameJamHosts(Database, jam)) || [];
            return res.status(200).json({ hosts: hosts, isOrganizer: isOrganizer });
        }
        case 'POST': {
            let body = req.body;
            if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
            if (!isObject(body)) body = JSON.parse(body);
            if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
            if (!isAdmin && !isOrganizer) return res.status(403).json({ error: 'Insufficient permissions' });

            try {
                await createScratchGameJamHost(Database, jam, body.username);
            } catch (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({ success: true });
        }
        case 'DELETE': {
            let body = req.body;
            if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
            if (!isObject(body)) body = JSON.parse(body);
            if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
            const isHostToBeRemovedAnOrganizer = await isScratchJamOrganizer(Database, slug[0], body.username);
            if (isHostToBeRemovedAnOrganizer === null) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host does not exist' } });
            if (isHostToBeRemovedAnOrganizer === true)
                return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host cannot be removed because they are the organizer' } });
            if (!isOrganizer && !isAdmin && body.username !== req.session.user.name) return res.status(403).json({ error: 'Insufficient permissions' });

            await removeScratchJamHost(Database, jam, body.username);
            return res.status(200).json({ success: true });
        }
        default: {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
