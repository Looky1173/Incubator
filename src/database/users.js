import { databaseCollections } from '@constants';
import clientPromise from './mongodb';

const client = await clientPromise;
const Database = client.db();

const Users = Database.collection(databaseCollections['users']);

export function getUserData(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await Users.findOne({
                name: username,
            });
            resolve(user);
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function createUser(document) {
    return new Promise(async (resolve, reject) => {
        try {
            await Users.insertOne(document);
            resolve();
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function deleteUser(username) {
    return new Promise(async (resolve, reject) => {
        try {
            await Users.deleteOne({ name: username });
            resolve();
        } catch (error) {
            reject(Error(error));
        }
    });
}
