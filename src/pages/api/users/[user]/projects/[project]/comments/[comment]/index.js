import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { user, project, comment: commentId } = req.query;

    let comment = await fetch(`https://api.scratch.mit.edu/users/${user}/projects/${project}/comments/${commentId}`).catch((e) => {
        return res.status(500).json({ error: { identifier: 'unknownError', message: 'The server was not able to handle this request', details: e, commentId: commentId } });
    });
    comment = await comment.json();

    return res.status(200).json(!comment ? { error: { identifier: 'commentNotFound', message: 'The requested comment was not found', commentId: commentId } } : comment);
}, sessionOptions);
