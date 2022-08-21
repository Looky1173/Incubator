import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { getScratchGameJamHosts, createScratchGameJamHost, removeScratchJamHost, isScratchJamOrganizer, ensureArchivedJamIntegrity } from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    const { jam } = req.query;
    const method = req.method;

    await ensureArchivedJamIntegrity(req, res, jam);

    const isOrganizer = await isScratchJamOrganizer(jam, req.session?.user?.name);

    if (method == 'GET') {
        const hosts = (await getScratchGameJamHosts(jam)) || [];
        return res.status(200).json({ hosts: hosts, isOrganizer: isOrganizer });
    }

    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    const isAdmin = (await getUserData(req.session.user.name)).admin;

    if (method === 'POST') {
        let body = req.body;
        if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
        if (!isObject(body)) body = JSON.parse(body);
        if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
        if (!isAdmin && !isOrganizer) return res.status(403).json({ error: 'Insufficient permissions' });

        try {
            await createScratchGameJamHost(jam, body.username);
        } catch (error) {
            return res.status(400).json({ error: error });
        }
        return res.status(200).json({ success: true });
    } else if (method === 'DELETE') {
        let body = req.body;
        if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
        if (!isObject(body)) body = JSON.parse(body);
        if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
        const isHostToBeRemovedAnOrganizer = await isScratchJamOrganizer(jam, body.username);
        if (isHostToBeRemovedAnOrganizer === null) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host does not exist' } });
        if (isHostToBeRemovedAnOrganizer === true)
            return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host cannot be removed because they are the organizer' } });
        if (!isOrganizer && !isAdmin && body.username !== req.session.user.name) return res.status(403).json({ error: 'Insufficient permissions' });

        await removeScratchJamHost(jam, body.username);
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
