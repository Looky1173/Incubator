import clientPromise from '@database';

export default async (req, res) => {
    const client = await clientPromise;
    const Database = client.db();

    console.log(await Database.collection('users').find({}).toArray());

    //const movies = await db.collection('movies').find({}).sort({ metacritic: -1 }).limit(20).toArray();
    res.json({ success: true });
};
