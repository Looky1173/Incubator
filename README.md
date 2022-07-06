# Incubator

Scratch Incubator hosts a number of interesting, open-source, and arguably useful experiments and tools. It's also a website to organize Scratch game jams!

Incubator is written in Next.js and React.

## Contributing

All contributions are welcome. If you have an idea for a new feature or experiment, [open a discussion](https://github.com/Looky1173/Incubator/discussions/new) about it. If your idea is approved you can help coding it and submit a pull request (PR) once you're done. You can also help squash bugs and other issues.

Please use Yarn as your package manager when working on Incubator.

### Folder structure and purposes

This will help you find your way around the codebase.

- root directory
  - [`public`](https://nextjs.org/docs/basic-features/static-file-serving) - Contains static files, such as the favicon.
  - `src` - Contains the main source code of Incubator
    - `components` - Custom React components specifically crafted for Incubator
      - `Jam` - Components for Scratch game jams
    - `database` - Driver files that directly interact with the MongoDB
      - `SCHEMAS.md` - Database document structure
    - `design-system` - Reusable components for building user interfaces
    - `hooks` - Custom React hooks for Incubator
    - [`pages`](https://nextjs.org/docs/basic-features/pages) - Contains the pages of the website, which are mapped to the directory structure of this folder
      - `api` - All API routes
      - `scratch-jams` - Routes related to Scratch game jams
      - `index.js` - The homepage
    - `utils` - Various utility files and methods
    - `constants.js` - Contains global constants, such as the array of whitelisted image hosts for Scratch game jams
  - `.env.local` - This file is not uploaded to GitHub. It is necessary for running a local instance of Incubator. It should contain the following *env* key-value pairs:
    - `SECRET_COOKIE_PASSWORD`: random password for encrypting [`iron-session`](https://github.com/vvo/iron-session) cookies;
    - `WEBSITE_URL`: the URL of the website. On *localhost*, this should be set to `http://localhost:3000`;
    - `MONGODB_URI`: the MongoDB connection URI. This should be in the following format: `mongodb+srv://<username>:<password>@<connection-uri>.mongodb.net/<database>?retryWrites=true&w=majority`.
  - `jsconfig.json` - Import path aliases (e.g., `import { Box } from '@design-system'`)
  - [`next.config.json`](https://nextjs.org/docs/api-reference/next.config.js/introduction) - Important Next.js configuration options. This file should generally not be touched.
  - [`package.json`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)

## Credits

[Looky1173](https://github.com/Looky1173)

[Weredime](https://github.com/Weredime)
