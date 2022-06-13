import { databaseCollections } from '@constants';
import { ObjectId } from 'mongodb';

export function getScratchGameJams(db, limit = 40, offset = 0, filters = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            if (offset < 0) offset = 0;

            let filterQuery = {};
            for (const filter in filters) {
                if (!filters.hasOwnProperty(filter)) continue;
                if (filters[filter] == null || filters[filter] == undefined) continue;

                switch (filter) {
                    case 'featured':
                        filterQuery.featured = filters[filter] == 'true' ? true : { $ne: true };
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

            let jamsCount = await db.collection(databaseCollections['scratch-jams']).countDocuments(filterQuery);

            let jamsCursor = await db.collection(databaseCollections['scratch-jams']).find(filterQuery).sort({ 'dates.start': -1, _id: -1 }).skip(Number(offset)).limit(Number(limit));
            let jams = await jamsCursor.toArray();

            resolve({ total: jamsCount, jams: jams });
        } catch (error) {
            reject(Error(error));
        }
    });
}

export function getScratchGameJam(db, jamId) {
    return new Promise(async (resolve, reject) => {
        try {
            let jam = await db.collection(databaseCollections['scratch-jams']).findOne({ _id: ObjectId(jamId) });

            resolve(jam);
        } catch (error) {
            reject(Error(error));
        }
    });
}
