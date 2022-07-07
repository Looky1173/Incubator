import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import { getScratchGameJams } from '@database/scratch-jams';
import { createScratchJam } from '@database/scratch-jams';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method === 'GET') {
        let jams = await getScratchGameJams(req.query.limit, req.query.offset, { featured: req.query.featured, status: req.query.status }, req.session?.user?.name);

        return res.status(200).json(jams);
    }

    if (req.method === 'POST' && !req.session.user) return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    if (req.method === 'POST') {
        let body = req.body;
        if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body' } });
        if (!isObject(body)) body = JSON.parse(body);

        try {
            const insertedId = await createScratchJam({ ...body }, req.session.user.name);
            return res.status(200).json({ success: true, insertedId: insertedId });
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: error });
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
