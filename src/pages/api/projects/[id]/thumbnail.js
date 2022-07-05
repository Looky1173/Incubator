import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

export default withIronSessionApiRoute(async (req, res) => {
    const { id } = req.query;

    if (req.method === 'GET') {
        const project = await (await fetch(`https://api.scratch.mit.edu/projects/${id}`)).json();

        return project?.code === 'NotFound'
                ? res.status(404).json({ error: { identifier: 'notFound', message: `Scratch cannot find the project with an ID of ${req.query.project}` } })
                : res.redirect(project.image);
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
