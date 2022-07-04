// We don't require authentication for this endpoint
export default async (req, res) => {
    const slug = req.query.user;

    if (req.method === 'GET') {
        let userData = null;
        try {
            userData = await fetch(`https://api.scratch.mit.edu/users/${slug}/`);
            userData = await userData.json();
        } catch(ex) {
            return res.status(500).json({ error: { identifier: 'unknownError', message: 'The server was not able to handle this request', details: ex } });
        }
        if (userData === null) return;

        return res.redirect(`https://uploads.scratch.mit.edu/get_image/user/${userData.id}_200x200.png`);
    }

    res.status(405).json({ error: 'Method not allowed' });
}
