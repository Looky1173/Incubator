import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';

export default withIronSessionApiRoute(async (req, res) => {
    const slug = req.query.project;

    if (req.method === 'GET') {
        const project = await (await fetch(`https://api.scratch.mit.edu/projects/${req.query.project}`)).json();

        if (slug.length === 1) {
            return project?.code === 'NotFound'
                ? res.status(404).json({ error: { identifier: 'notFound', message: `Scratch cannot find the project with an ID of ${req.query.project}` } })
                : res.status(200).json(project);
        } else if (slug.length === 2 && slug[1] === 'thumbnail') {
            return project?.code === 'NotFound'
                ? res.status(404).json({ error: { identifier: 'notFound', message: `Scratch cannot find the project with an ID of ${req.query.project}` } })
                : res.redirect(project.image);
        }
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
