import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { makeScratchJamOrganizer, isScratchJamOrganizer, ensureArchivedJamIntegrity } from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    const { jam } = req.query;

    await ensureArchivedJamIntegrity(req, res, jam);

    const isAdmin = (await getUserData(req.session.user.name)).admin;
    const isOrganizer = await isScratchJamOrganizer(jam, req.session.user.name);

    let body = req.body;
    if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
    if (!isObject(body)) body = JSON.parse(body);
    if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
    const isNewHostAnOrganizer = await isScratchJamOrganizer(jam, body.username);
    if (isNewHostAnOrganizer === null) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host does not exist' } });
    if (isNewHostAnOrganizer === true) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host is already the organizer' } });
    if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

    await makeScratchJamOrganizer(jam, body.username);
    return res.status(200).json({ success: true });
}, sessionOptions);
