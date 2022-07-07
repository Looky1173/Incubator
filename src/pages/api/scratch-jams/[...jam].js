import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@constants';
import {
    getScratchGameJam,
    getScratchGameJamSubmissions,
    getScratchGameJamHosts,
    createScratchGameJamHost,
    isScratchJamOrganizer,
    makeScratchJamOrganizer,
    removeScratchJamHost,
    changeScratchJamThumbnail,
    updateScratchJam,
    archiveScratchJam,
    deleteScratchJam,
    saveScratchGameJamSubmission,
    getScratchGameJamSubmission,
    getScratchGameJamStatistics,
    getScratchGameJamSubmissionUpvotes,
    saveScratchGameJamSubmissionUpvote,
    removeScratchGameJamSubmissionUpvote,
    removeScratchGameJamSubmission,
} from '@database/scratch-jams';
import { getUserData } from '@database/users';
import { isObjectEmpty, isObject } from '@utils/object';

export default withIronSessionApiRoute(async (req, res) => {
    const slug = req.query.jam;

    const isAdmin = (await getUserData(req.session?.user?.name))?.admin;
    const isOrganizer = await isScratchJamOrganizer(slug[0], req.session?.user?.name);

    const jam = await getScratchGameJam(slug[0], req.session?.user?.name);
    if (jam.meta?.archived === true && !isAdmin)
        return res.status(403).json({ error: { identifier: 'insufficientPermissions', message: 'You do not have permission to access archived game jams. Only administrators can do that.' } });

    if (req.method === 'GET') {
        if (slug.length === 1) {
            // Retrieves the details of the requested game jam
            const jam = await getScratchGameJam(slug[0], req.session?.user?.name);

            return jam ? res.status(200).json(jam) : res.status(404).json({ error: { identifier: 'notFound', message: 'Not found' } });
        } else if (slug.length === 2) {
            // Retrieves the submissions or hosts a game jam
            if (slug[1] === 'submissions') {
                const submissions = await getScratchGameJamSubmissions(slug[0], { limit: req.query.limit, offset: req.query.offset, sort: req.query.sort });
                return res.status(200).json(submissions);
            }
            if (slug[1] === 'hosts') {
                const hosts = (await getScratchGameJamHosts(slug[0])) || [];
                return res.status(200).json({ hosts: hosts, isOrganizer: isOrganizer });
            }
            if (slug[1] === 'statistics') {
                const statistics = await getScratchGameJamStatistics(slug[0], req.session?.user?.name);
                return res.status(200).json(statistics);
            }
        } else if (slug.length === 3 && slug[1] === 'submissions') {
            const submission = await getScratchGameJamSubmission(slug[0], slug[2]);
            return submission ? res.status(200).json(submission) : res.status(404).json({ error: { identifier: 'notFound', message: 'The requested submission could not be found' } });
        } else if (slug.length === 4 && slug[1] === 'submissions' && slug[3] === 'upvotes') {
            const upvotes = await getScratchGameJamSubmissionUpvotes(slug[0], slug[2], req.session?.user?.name);
            return res.status(200).json(upvotes);
        }

        return res.status(404).json({ error: 'Method not found' });
    }

    if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && !req.session.user)
        return res.status(401).json({ error: { identifier: 'authorizationRequired', message: 'Authorization is required for this endpoint' } });

    if (req.method === 'POST') {
        if (slug.length === 2) {
            // Inserts a new submission, host or upvote record into the database
            if (slug[1] === 'submissions') {
                let body = req.body;
                if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with project ID' } });
                if (!isObject(body)) body = JSON.parse(body);
                if (!body.projectId) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing project ID' } });

                try {
                    await saveScratchGameJamSubmission(slug[0], body.projectId, req.session.user.name);
                } catch (error) {
                    console.log(error);
                    return res.status(400).json({ error: error });
                }
                return res.status(200).json({ success: true });
            }
            if (slug[1] === 'hosts') {
                let body = req.body;
                if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
                if (!isObject(body)) body = JSON.parse(body);
                if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
                if (!isAdmin && !isOrganizer) return res.status(403).json({ error: 'Insufficient permissions' });

                try {
                    await createScratchGameJamHost(slug[0], body.username);
                } catch (error) {
                    return res.status(400).json({ error: error });
                }
                return res.status(200).json({ success: true });
            }
        } else if (slug.length === 4 && slug[1] === 'submissions' && slug[3] === 'upvotes') {
            try {
                await saveScratchGameJamSubmissionUpvote(slug[0], slug[2], req.session.user.name);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(error.identifier === 'notFound' ? 400 : 403).json({ error: error });
            }
        }

        return res.status(404).json({ error: 'Method not found' });
    }

    if (req.method === 'PUT') {
        if (slug.length === 1) {
            let body = req.body;
            if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body' } });
            if (!isObject(body)) body = JSON.parse(body);
            if ((!isOrganizer && !isAdmin) || (body.hasOwnProperty('meta.featured') && !isAdmin)) return res.status(403).json({ error: 'Insufficient permissions' });

            try {
                await updateScratchJam(slug[0], { ...body });
            } catch (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({ success: true });
        } else if (slug.length === 2) {
            if (slug[1] === 'thumbnail') {
                let body = req.body;
                if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with thumbnail URL' } });
                if (!isObject(body)) body = JSON.parse(body);
                if (!body.thumbnailURL) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing thumbnail URL' } });
                if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

                await changeScratchJamThumbnail(slug[0], body.thumbnailURL);
                return res.status(200).json({ success: true });
            }
            if (slug[1] === 'archive') {
                let body = req.body;
                if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with archived state' } });
                if (!isObject(body)) body = JSON.parse(body);
                if (body.archived !== true && body.archived !== false) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing archived state' } });
                if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

                try {
                    await archiveScratchJam(slug[0], body.archived);
                } catch (error) {
                    return res.status(400).json({ error: error });
                }
                return res.status(200).json({ success: true });
            }
        } else if (slug.length === 3 && slug[1] === 'hosts' && slug[2] === 'transfer') {
            let body = req.body;
            if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
            if (!isObject(body)) body = JSON.parse(body);
            if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
            const isNewHostAnOrganizer = await isScratchJamOrganizer(slug[0], body.username);
            if (isNewHostAnOrganizer === null) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host does not exist' } });
            if (isNewHostAnOrganizer === true) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host is already the organizer' } });
            if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

            await makeScratchJamOrganizer(slug[0], body.username);
            return res.status(200).json({ success: true });
        }
        return res.status(404).json({ error: 'Method not found' });
    }

    if (req.method === 'DELETE') {
        if (slug.length === 1) {
            if (!isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

            try {
                await deleteScratchJam(slug[0]);
            } catch (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({ success: true });
        } else if (slug.length === 2) {
            if (slug[1] === 'thumbnail') {
                // Removes the current thumbnail
                if (!isOrganizer && !isAdmin) return res.status(403).json({ error: 'Insufficient permissions' });

                await changeScratchJamThumbnail(slug[0], null);
                return res.status(200).json({ success: true });
            }
            if (slug[1] === 'hosts') {
                let body = req.body;
                if (isObjectEmpty(body)) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing body with host username' } });
                if (!isObject(body)) body = JSON.parse(body);
                if (!body.username) return res.status(400).json({ error: { identifier: 'missingParameters', message: 'Missing host username' } });
                const isHostToBeRemovedAnOrganizer = await isScratchJamOrganizer(slug[0], body.username);
                if (isHostToBeRemovedAnOrganizer === null) return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host does not exist' } });
                if (isHostToBeRemovedAnOrganizer === true)
                    return res.status(400).json({ error: { identifier: 'nonexistentHost', message: 'The given host cannot be removed because they are the organizer' } });
                if (!isOrganizer && !isAdmin && body.username !== req.session.user.name) return res.status(403).json({ error: 'Insufficient permissions' });

                await removeScratchJamHost(slug[0], body.username);
                return res.status(200).json({ success: true });
            }
        } else if (slug.length === 3 && slug[1] === 'submissions') {
            const statistics = await getScratchGameJamStatistics(slug[0], req.session.user.name);
            const removingOwnSubmissions = statistics.participation.project === slug[2];
            const canRemoveSubmission = removingOwnSubmissions || isAdmin || isOrganizer !== null;

            if (!canRemoveSubmission) return res.status(403).json({ error: 'Insufficient permissions' });

            try {
                await removeScratchGameJamSubmission(slug[0], slug[2]);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(400).json({ error: error });
            }
        } else if (slug.length === 4 && slug[1] === 'submissions' && slug[3] === 'upvotes') {
            try {
                await removeScratchGameJamSubmissionUpvote(slug[0], slug[2], req.session.user.name);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(400).json({ error: error });
            }
        }
        return res.status(404).json({ error: 'Method not found' });
    }

    res.status(405).json({ error: 'Method not allowed' });
}, sessionOptions);
