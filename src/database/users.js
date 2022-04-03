import { databaseCollections } from '@constants';

export function getUserData(db, username) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.collection(databaseCollections.users).findOne({
                name: username,
            });
            resolve(user);
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function createUser(db, document) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection(databaseCollections.users).insertOne(document);
            resolve();
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function deleteUser(db, username) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection(databaseCollections.users).deleteOne({ name: username });
            resolve();
        } catch (error) {
            reject(Error(error));
        }
    });
}
