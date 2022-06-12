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
};

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const imageDomains = ['assets.scratch.mit.edu', 'cdn2.scratch.mit.edu'];
