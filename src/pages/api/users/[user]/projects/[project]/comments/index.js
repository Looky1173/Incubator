import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { user, project, offset = 0, limit = 20 } = req.query;

    let comments = await fetch(`https://api.scratch.mit.edu/users/${user}/projects/${project}/comments?offset=${offset}&limit=${limit}`).catch((e) => {
        return res.status(500).json({ error: { identifier: 'unknownError', message: 'The server was not able to handle this request', details: e } });
    });
    comments = await comments.json();

    return res.status(200).json(comments);
}, sessionOptions);
