/** @type {import("iron-session").IronSessionOptions} */
export const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'incubator-secret-token',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};


export const databaseCollections = {
    users: 'users',
    'scratch-jams': 'jams',
    'scratch-jam-hosts': 'hosts',
    'scratch-jam-submissions': 'submissions',
    'scratch-jam-upvotes': 'upvotes',
};

/**
 * Request data from an URI.
 * @param {string} uri
 * @param {Request} opts
 * @returns {Object}
 * @throws {FetchError}
 */
export const fetcher = async (...args) => {
    const res = await fetch(...args);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    return res.json();
};

/** @type {string[]} */
export const imageDomains = ['assets.scratch.mit.edu', 'cdn2.scratch.mit.edu', 'u.cubeupload.com', 'uploads.scratch.mit.edu'];

/** @type {number} */
export const MAXIMUM_UPVOTES_PER_JAM = 3;
