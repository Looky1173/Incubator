import { databaseCollections, MAXIMUM_UPVOTES_PER_JAM } from '@constants';
import { ObjectId } from 'mongodb';
import { getUserData } from './users';
import clientPromise from './mongodb';

const client = await clientPromise;
const Database = client.db();

const Jams = Database.collection(databaseCollections['scratch-jams']);
const Hosts = Database.collection(databaseCollections['scratch-jam-hosts']);
const Submissions = Database.collection(databaseCollections['scratch-jam-submissions']);
const Upvotes = Database.collection(databaseCollections['scratch-jam-upvotes']);
const Users = Database.collection(databaseCollections['users']);

const isBoolean = (val) => val === false || val === true;

const getJamsHostedByUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pipeline = [
                {
                    $match: {
                        name: username,
                    },
                },
                {
                    $group: {
                        _id: null,
                        array: {
                            $push: '$jam',
                        },
                    },
                },
                {
                    $project: {
                        array: true,
                        _id: false,
                    },
                },
            ];

            const aggregationResultCursor = await Hosts.aggregate(pipeline);
            const aggregationResult = await aggregationResultCursor.toArray();

            resolve(aggregationResult?.[0]?.array || []);
        } catch (error) {
            reject(Error(error));
        }
    });
};

export function getScratchGameJams(limit = 40, offset = 0, filters = {}, username) {
    return new Promise(async (resolve, reject) => {
        try {
            if (offset < 0) offset = 0;

            let filterQuery = {};
            for (const filter in filters) {
                if (!filters.hasOwnProperty(filter)) continue;
                if (filters[filter] == null || filters[filter] == undefined) continue;

                switch (filter) {
                    case 'featured':
                        filterQuery['meta.featured'] = filters[filter] == 'true' ? true : { $ne: true };
                        break;
                    case 'status':
                        let now = new Date();

                        switch (filters[filter]) {
                            case 'upcoming':
                                filterQuery['dates.start'] = { $gt: now };
                                break;
                            case 'ongoing':
                                filterQuery['dates.start'] = { $lte: now };
                                filterQuery['dates.end'] = { $gt: now };
                                break;
                            case 'ended':
                                filterQuery['dates.end'] = { $lte: now };
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }

            // Don't return archived game jams
            filterQuery['meta.archived'] = { $ne: true };

            let jamsCount = await Jams.countDocuments(filterQuery);

            let jamsCursor = await Jams.find(filterQuery).sort({ 'dates.start': -1, _id: -1 }).skip(Number(offset)).limit(Number(limit));
            let jams = await jamsCursor.toArray();

            const isAdmin = (await getUserData(username))?.admin;
            if (!isAdmin) {
                // If the game jam has not started yet and mystery mode is enabled, don't return the game jam's body, except if the user is a host, co-host, or an administrator
                const jamsHostedByUsername = await getJamsHostedByUsername(username);

                let jamsHostedByUsernameObject = [];
                jamsHostedByUsername.forEach((value) => {
                    jamsHostedByUsernameObject.push(new ObjectId(value).toString());
                });

                jams.forEach((value, index) => {
                    if (value?.settings?.enableMystery && new Date(value.dates.start) > new Date() && !jamsHostedByUsernameObject.includes(new ObjectId(value._id).toString()))
                        delete jams[index].content.body;
                });
            }

            resolve({ total: jamsCount, jams: jams });
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function getScratchGameJam(jamId, username) {
    return new Promise(async (resolve, reject) => {
        try {
            let jam = await Jams.findOne({ _id: ObjectId(jamId) });
            const isOrganizer = await isScratchJamOrganizer(jamId, username);
            const isAdmin = (await getUserData(username))?.admin;
            if (jam.settings.enableMystery === true && isOrganizer === null && !isAdmin && new Date(jam.dates.start) > new Date()) delete jam.content.body;

            resolve(jam);
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function getScratchGameJamSubmissions(jamId, options = { limit: 6, offset: 0, sort: null }) {
    return new Promise(async (resolve, reject) => {
        try {
            if (options.offset < 0) options.offset = 0;

            const sortByUpvotes = options.sort === 'upvotes';
            let upvoteSortRankings = [];
            let submissionsByUpvotes = [];

            if (sortByUpvotes) {
                const pipeline = [
                    {
                        $match: {
                            jam: new ObjectId(jamId),
                        },
                    },
                    {
                        $sortByCount: '$project',
                    },
                    {
                        $project: {
                            _id: false,
                            project: '$_id',
                            count: true,
                        },
                    },
                ];

                const aggregationResultCursor = await Upvotes.aggregate(pipeline);
                const aggregationResult = await aggregationResultCursor.toArray();

                upvoteSortRankings = aggregationResult.map((x) => x.project);
            }

            const getSortQuery = (sort) => {
                const options = { newest: { 'meta.submitted': -1, _id: -1 }, oldest: { 'meta.submitted': 1, _id: 1 } };
                return options?.[sort] || options.newest;
            };

            let submissionsCursor = sortByUpvotes
                ? await Submissions.find({ jam: ObjectId(jamId) }).sort(getSortQuery('oldest'))
                : await Submissions.find({ jam: ObjectId(jamId) })
                      .sort(getSortQuery(options.sort))
                      .skip(Number(options.offset))
                      .limit(Number(options.limit));
            let submissions = await submissionsCursor.toArray();

            if (sortByUpvotes) {
                // Based on https://stackoverflow.com/a/54525940
                submissionsByUpvotes = submissions.sort((a, b) => {
                    const aIndex = upvoteSortRankings.indexOf(a.project);
                    const bIndex = upvoteSortRankings.indexOf(b.project);
                    return (aIndex === -1 ? Number.MAX_VALUE : aIndex) - (bIndex === -1 ? Number.MAX_VALUE : bIndex);
                });

                submissionsByUpvotes = submissionsByUpvotes.slice(options.offset, options.offset + options.limit);
            }

            resolve(sortByUpvotes ? submissionsByUpvotes : submissions);
        } catch (error) {
            reject(error);
        }
    });
}

export function getScratchGameJamSubmission(jamId, project) {
    return new Promise(async (resolve, reject) => {
        try {
            const submission = await Submissions.findOne({ jam: ObjectId(jamId), project: Number(project) });

            resolve(submission);
        } catch (error) {
            reject(error);
        }
    });
}

export function saveScratchGameJamSubmission(jamId, projectId, author) {
    return new Promise(async (resolve, reject) => {
        try {
            const jam = await Jams.findOne({ _id: ObjectId(jamId) });
            // Make sure that the specified game jam exists
            if (!jam) return reject({ identifier: 'notFound', message: 'The specified game jam does not exist' });

            const now = new Date();
            // Make sure that the specified game jam is accepting submissions
            if (!(new Date(jam.dates.start) <= now && now < new Date(jam.dates.end))) return reject({ identifier: 'inactiveGameJam', message: 'You can only submit projects to ongoing game jams' });

            // Make sure that the user hasn't already submitted a project to the specified game jam
            if ((await Submissions.countDocuments({ jam: ObjectId(jamId), author: author })) > 0)
                return reject({ identifier: 'alreadyParticipating', message: 'You have already submitted a project to this game jam' });

            const project = await (await fetch(`https://api.scratch.mit.edu/projects/${projectId}`)).json();
            // Make sure that the project exists on Scratch and that it is shared
            if (project?.code === 'NotFound')
                return reject({
                    identifier: 'notFound',
                    message: `Scratch cannot find the project with an ID of ${projectId}! You might have mistyped the project's URL, or the given project is unshared`,
                });
            // Make sure that it is indeed the user who has created the project
            if (project.author.username !== author) return reject({ identifier: 'falseProjectOwnership', message: 'Sorry, you can only submit projects that you created' });

            await Submissions.insertOne({ jam: ObjectId(jamId), project: Number(projectId), author: author, meta: { submitted: new Date() } });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function getScratchGameJamHosts(jamId) {
    return new Promise(async (resolve, reject) => {
        try {
            const hostsCursor = Hosts.find({ jam: ObjectId(jamId) });
            const hosts = await hostsCursor.toArray();
            resolve(hosts);
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function isScratchJamOrganizer(jamId, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const host = await Hosts.findOne({ jam: ObjectId(jamId), name: username });
            resolve(isBoolean(host?.organizer) ? host.organizer : null);
        } catch (error) {
            reject(error);
        }
    });
}

export function createScratchGameJamHost(jamId, hostUsername) {
    return new Promise(async (resolve, reject) => {
        try {
            if (await Hosts.findOne({ jam: ObjectId(jamId), name: hostUsername })) return reject({ identifier: 'hostExists', message: 'The specified user is already a host of the given game jam' });
            if (!(await Jams.findOne({ _id: ObjectId(jamId) }))) return reject({ identifier: 'nonexistentJam', message: 'The specified jam does not exist' });
            if (!(await Users.findOne({ name: hostUsername }))) return reject({ identifier: 'nonexistentUser', message: "The specified user does not exist in Incubator's database" });

            await Hosts.insertOne({ jam: ObjectId(jamId), name: hostUsername, organizer: false });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function makeScratchJamOrganizer(jamId, newHostUsername) {
    return new Promise(async (resolve, reject) => {
        try {
            await Hosts.updateMany({ jam: ObjectId(jamId), organizer: true }, { $set: { organizer: false } });
            await Hosts.updateOne({ jam: ObjectId(jamId), name: newHostUsername }, { $set: { organizer: true } });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function removeScratchJamHost(jamId, hostToBeRemoved) {
    return new Promise(async (resolve, reject) => {
        try {
            await Hosts.deleteOne({ jam: ObjectId(jamId), name: hostToBeRemoved });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function changeScratchJamThumbnail(jamId, thumbnailURL) {
    return new Promise(async (resolve, reject) => {
        try {
            await Jams.updateOne({ _id: ObjectId(jamId) }, { $set: { 'content.headerImage': thumbnailURL } });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const resolveObjectPath = (path, obj, separator = '.') => {
    let properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
};

const validateScratchJamDate = (type, date, details = {}) => {
    const now = new Date();
    const dateToValidate = new Date(date);

    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date) || dateToValidate.toISOString() !== date)
        return { identifier: 'invalidDate', message: `The given ${type} date is not valid or it does not conform to the ISO8601 standard` };

    if (type === 'start') {
        if (dateToValidate < now) return { identifier: 'startDateCannotBeInThePast', message: 'The start date cannot be in the past' };
        if (dateToValidate > new Date(details.end)) return { identifier: 'startDateCannotBeAfterTheEndDate', message: 'The start date cannot be after the end date' };
    } else {
        if (dateToValidate < now) return { identifier: 'endDateCannotBeInThePast', message: 'The end date cannot be in the past' };
        if (dateToValidate < new Date(details.start)) return { identifier: 'endDateCannotBeBeforeTheStartDate', message: 'The end date cannot be before the start date' };
    }

    if (new Date(details.end) - new Date(details.start) > 1000 * 60 * 60 * 24 * 60)
        return { identifier: 'intervalTooLong', message: 'The end and start dates must not cover an interval longer than 60 days' };

    return true;
};

const limitCharacters = (string, limit = 100, error = null) => {
    const trimmedString = string.replace(/\s\s+/g, ' ');

    return trimmedString.length <= limit ? true : error || { identifier: 'stringTooLong', message: `The given string exceeds the ${limit} character limit` };
};

const insertWithCorrectType = (key, value) => {
    let correctValue = value;
    switch (key) {
        case 'dates.start':
        case 'dates.end':
            correctValue = new Date(value);
            break;
        case 'name':
        case 'content.description':
            correctValue = value.replace(/\s\s+/g, ' ');
            break;
        case 'content.body':
            correctValue = JSON.stringify(value);
            break;
        default:
            break;
    }

    return correctValue;
};

const requiredParamNotEmpty = (value, error) => {
    return value === null || value === undefined || value === '' || value?.length === 0 ? error || { identifier: 'emptyVariable', message: `The given variable is required but it is empty` } : true;
};

const JAM_SCHEMA_VALIDATORS = {
    name: (value) => {
        const empty = requiredParamNotEmpty(value.replace(/\s/g, ''), { identifier: 'nameEmpty', message: 'The title is required' });
        return empty === true ? limitCharacters(value, 120, { identifier: 'nameTooLong', message: 'The title of a game jam cannot exceed 120 characters' }) : empty;
    },
    /*slug: null,*/
    content: {
        description: (value) => limitCharacters(value, 500, { identifier: 'descriptionTooLong', message: 'The description of a game jam cannot exceed 500 characters' }),
        body: (value) => requiredParamNotEmpty(value, { identifier: 'bodyEmpty', message: 'The main description is required and it should not be empty' }),
        headerImage: (value) => limitCharacters(value, 300, { identifier: 'thumbnailURLTooLong', message: 'The cover image URL cannot exceed 300 characters' }),
    },
    dates: {
        start: (date, dateDetails) => validateScratchJamDate('start', date, dateDetails),
        end: (date, dateDetails) => validateScratchJamDate('end', date, dateDetails),
    },
    settings: {
        allowVoting: (value) => isBoolean(value),
        restrictVotingToHosts: (value) => isBoolean(value),
        enableMystery: (value) => isBoolean(value),
        allowTeams: (value) => isBoolean(value),
    },
    meta: {
        featured: (value) => isBoolean(value),
        archived: (value) => isBoolean(value),
    },
};

const validateJamSchema = (schema, data, miscellaneous) => {
    let validData;
    for (const [key, value] of Object.entries(data)) {
        const validator = resolveObjectPath(key, schema);

        if (validator === undefined) continue;
        if (validator === null && typeof test !== 'function') {
            validData = { ...validData, ...{ [key]: insertWithCorrectType(key, value) } };
            continue;
        }

        const validatorResult = validator(value, miscellaneous.dateDetails);

        if (validatorResult === true) {
            validData = { ...validData, ...{ [key]: insertWithCorrectType(key, value) } };
        } else {
            return { success: false, error: { identifier: validatorResult?.identifier, message: validatorResult?.message } };
        }
    }

    return { success: true, validData: validData };
};

export function createScratchJam(jamContent, creator) {
    return new Promise(async (resolve, reject) => {
        const dateDetails = { start: jamContent['dates.start'] || null, end: jamContent['dates.end'] || null };

        try {
            let jamSchemaValidators = JAM_SCHEMA_VALIDATORS;
            delete jamSchemaValidators.settings.allowVoting;
            delete jamSchemaValidators.settings.restrictVotingToHosts;
            delete jamSchemaValidators.settings.allowTeams;
            delete jamSchemaValidators.meta;

            let newJam = validateJamSchema(jamSchemaValidators, jamContent, { dateDetails: dateDetails });

            if (newJam.success === false || newJam.success !== true)
                return reject({
                    identifier: newJam.error.identifier || 'failedValidation',
                    message: newJam.error.message || 'The request contained at least one invalid value, therefore no game jam was created',
                });

            delete newJam.success;
            newJam = newJam.validData;

            const result = await Jams.insertOne({
                name: newJam.name,
                content: { description: newJam['content.description'], body: newJam['content.body'], headerImage: newJam['content.headerImage'] },
                dates: {
                    start: newJam['dates.start'],
                    end: newJam['dates.end'],
                },
                settings: {
                    enableMystery: newJam['settings.enableMystery'],
                    allowVoting: true,
                    restrictVotingToHosts: false,
                    allowTeams: false,
                },
                meta: {
                    featured: false,
                    archived: false,
                    updated: new Date(),
                },
            });
            await Hosts.insertOne({ jam: ObjectId(result.insertedId), name: creator, organizer: true });

            resolve(result.insertedId);
        } catch (error) {
            reject(error);
        }
    });
}

export function updateScratchJam(jamId, updates) {
    return new Promise(async (resolve, reject) => {
        const jam = await Jams.findOne({ _id: ObjectId(jamId) });
        const dateDetails = { start: updates['dates.start'] || jam?.dates.start, end: updates['dates.end'] || jam?.dates.end };

        try {
            let jamSchemaValidators = JAM_SCHEMA_VALIDATORS;
            delete jamSchemaValidators.content.headerImage;
            delete jamSchemaValidators.meta.archived;

            let jamUpdates = validateJamSchema(jamSchemaValidators, updates, { dateDetails: dateDetails });

            if (jamUpdates.success === false || jamUpdates.success !== true)
                return reject({
                    identifier: jamUpdates.error.identifier || 'failedValidation',
                    message: jamUpdates.error.message || 'The update request contained at least one invalid value, therefore the specified jam was not updated',
                });

            delete jamUpdates.success;
            jamUpdates = jamUpdates.validData;
            jamUpdates = { ...jamUpdates, 'meta.updated': new Date() };

            await Jams.updateOne({ _id: ObjectId(jamId) }, { $set: jamUpdates });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function archiveScratchJam(jamId, archived) {
    return new Promise(async (resolve, reject) => {
        try {
            if (isBoolean(archived)) {
                await Jams.updateOne({ _id: ObjectId(jamId) }, { $set: { 'meta.archived': archived } });
                resolve();
            } else {
                reject({ identifier: 'badValue', message: `Expected a boolean, got ${typeof archived}` });
            }
        } catch (error) {
            reject(error);
        }
    });
}

export function deleteScratchJam(jamId) {
    return new Promise(async (resolve, reject) => {
        try {
            await Jams.deleteOne({ _id: ObjectId(jamId) });
            await Hosts.deleteMany({ jam: ObjectId(jamId) });
            await Submissions.deleteMany({ jam: ObjectId(jamId) });
            await Upvotes.deleteMany({ jam: ObjectId(jamId) });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function getScratchGameJamStatistics(jamId, username = undefined) {
    return new Promise(async (resolve, reject) => {
        try {
            const numberOfSubmissions = await Submissions.countDocuments({ jam: ObjectId(jamId) });
            const numberOfUpvotes = await Upvotes.countDocuments({ jam: ObjectId(jamId) });

            let response = { submissions: numberOfSubmissions, upvotes: numberOfUpvotes, feedback: 0 };

            if (username) {
                const participation = await Submissions.findOne({ jam: ObjectId(jamId), author: username });
                response = participation ? { ...response, participation: { hasParticipated: true, project: participation.project } } : { ...response, participation: { hasParticipated: false } };

                const upvotesCast = await Upvotes.countDocuments({ jam: ObjectId(jamId), 'meta.upvotedBy': username });
                response = { ...response, remainingUpvotes: MAXIMUM_UPVOTES_PER_JAM - upvotesCast };
            }

            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export function getScratchGameJamSubmissionUpvotes(jamId, project, username = undefined) {
    return new Promise(async (resolve, reject) => {
        try {
            const upvotesCursor = await Upvotes.find({ jam: ObjectId(jamId), project: Number(project) });
            const upvotes = await upvotesCursor.toArray();

            let response = { count: upvotes.length || 0 };

            if (username) {
                response = { ...response, upvoted: upvotes.some((upvote) => upvote.meta.upvotedBy === username) ? true : false };
            }

            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export function saveScratchGameJamSubmissionUpvote(jamId, project, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const jam = await Jams.findOne({ _id: ObjectId(jamId) });
            if (!jam) return reject({ identifier: 'notFound', message: 'The requested game jam could not be found' });

            const remainingUpvotes = MAXIMUM_UPVOTES_PER_JAM - (await Upvotes.countDocuments({ jam: ObjectId(jamId), 'meta.upvotedBy': username }));
            if (remainingUpvotes === 0) return reject({ identifier: 'upvoteQuotaHit', message: `You cannot upvote more than ${MAXIMUM_UPVOTES_PER_JAM} submissions per game jam` });

            if ((await Upvotes.countDocuments({ jam: ObjectId(jamId), project: Number(project), 'meta.upvotedBy': username })) > 0)
                return reject({ identifier: 'alreadyUpvoted', message: 'You have already upvoted the given submission in the given game jam' });

            await Upvotes.insertOne({ jam: ObjectId(jamId), project: Number(project), meta: { upvoted: new Date(), upvotedBy: username } });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function removeScratchGameJamSubmissionUpvote(jamId, project, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const jam = await Jams.findOne({ _id: ObjectId(jamId) });
            if (!jam) return reject({ identifier: 'notFound', message: 'The requested game jam could not be found' });

            await Upvotes.deleteOne({ jam: ObjectId(jamId), project: Number(project), 'meta.upvotedBy': username });
            console.log(project, username);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export function removeScratchGameJamSubmission(jamId, project) {
    return new Promise(async (resolve, reject) => {
        try {
            await Upvotes.deleteMany({ jam: ObjectId(jamId), project: Number(project) });
            await Submissions.deleteOne({ jam: ObjectId(jamId), project: Number(project) });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
