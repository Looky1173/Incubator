import { databaseCollections } from '@constants';

export function getScratchGameJams(db, limit = 40, offset = 0, featured = null) {
    return new Promise(async (resolve, reject) => {
        try {
            if (offset < 0) offset = 0;

            let filterQuery = {};
            if (featured != null || featured != undefined) {
                if (featured == 'true') {
                    filterQuery.featured = true;
                } else {
                    filterQuery.featured = { $ne: true };
                }
            }

            let jamsCount = await db.collection(databaseCollections['scratch-jams']).countDocuments({});

            let jamsCursor = await db.collection(databaseCollections['scratch-jams']).find(filterQuery).sort({ 'dates.start': -1, _id: -1 }).skip(Number(offset)).limit(Number(limit));
            let jams = await jamsCursor.toArray();

            resolve({ total: jamsCount, jams: jams });
        } catch (error) {
            reject(Error(error));
        }
    });
}
