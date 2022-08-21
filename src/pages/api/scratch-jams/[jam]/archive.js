import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

import { archiveScratchJam, isScratchJamOrganizer } from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
    if (!req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    const { jam } = req.query;

    const isAdmin = (await getUserData(req.session.user.name)).admin;
    const isOrganizer = await isScratchJamOrganizer(jam, req.session.user.name);

    let body = req.body;
    if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with archived state' } });
    if (!isObject(body)) body = JSON.parse(body);
    if (body.archived !== true && body.archived !== false) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing archived state' } });
    if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

    try {
        await archiveScratchJam(jam, body.archived);
    } catch (error) {
        return res.status(400).json({ error: error });
    }
    return res.status(200).json({ success: true });
}, sessionOptions);
