export const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'incubator-secret-token',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export const databaseCollections = {
    users: 'users',
};
