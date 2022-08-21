# Incubator - Scratch Game Jams - Database Schemas

## Users - `users`

```js
{
    _id: ObjectId(),
    name: String,
    admin?: Boolean,
    banned?: Boolean,
    meta: {
        updated: ISODate(),
        updatedBy: String
    }
}
```

## Game jams - `jams`

```js
{
    _id: ObjectId(),
    name: String,
    slug: String, // URL representation of `name`
    content: {
        headerImage?: String,
        description?: String,
        body: JSON()
    },
    dates: {
        start: ISODate(),
        end: ISODate()
    },
    settings: {
        allowVoting: Boolean,
        restrictVotingToHosts: Boolean,
        enableMystery: Boolean,
        allowTeams: Boolean
    },
    meta: {
        featured: Boolean,
        archived: Boolean, // Archived jams are read-only
        updated: ISODate(),
        updatedBy: String
    }
}
```

## Hosts - `hosts`

```js
{
    _id: ObjectId(),
    name: String,
    jam: ObjectId(), // The `ObjectId()` of the host's jam
    organizer: Boolean
}
```

## Submissions - `submissions`

```js
{
    _id: ObjectId(),
    project: Number,
    jam: ObjectId(), // The `ObjectId()` of the submission's jam
    author?: String,
    teamSubmission?: Boolean,
    team?: ObjectId(), // The `ObjectId()` of the team submitting the project
    feedback?: [
        { author: String, comment: Number }, // `author`: The username of the host to whom the feedback belongs; `comment`: The Scratch comment ID which represents the feedback
        ...
    ],
    meta: {
        submitted: ISODate()
    }
}
```

## Upvotes - `upvotes`

```js
{
    _id: ObjectId(),
    project: ObjectId(), // The `ObjectId()` of the upvoted submission
    jam: ObjectId(), // The `ObjectId()` of the submission's jam
    meta: {
        upvoted: ISODate(),
        upvotedBy: String
    }
}
```
