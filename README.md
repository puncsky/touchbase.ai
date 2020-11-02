# touchbase.ai

touchbase.ai is the easy, open source way for everyone to smartly engage more in meaningful relationships.

[![CircleCI](https://circleci.com/gh/puncsky/touchbase.ai/tree/master.svg?style=svg)](https://circleci.com/gh/puncsky/touchbase.ai/tree/master)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/puncsky/touchbase.ai)

![touchbase.ai screenshot](https://res.cloudinary.com/dohtidfqh/image/upload/v1570181029/web-guiguio/guanxilab-screenshot.png)

- [Documentation](https://onefx.js.org/doc.html?utm_source=github-iotex-explorer)
- [Contributing](https://onefx.js.org/contributing.html?utm_source=github-iotex-explorer)

## Getting Started

```bash
git clone git@github.com:puncsky/touchbase.ai.git
```

### Run your project

This is intended for \*nix users. If you use Windows, go to [Run on Windows](#run-on-windows). Let's first prepare the environment.

```bash
cd touchbase.ai

nvm use 10.15.0
npm install

# prepare environment variable
cp ./.env.tmpl ./.env
```

Note: please provide your MongoDB URI like `MONGODB_URI=mongodb://localhost:27017/touchbase` in `./.env` file.

#### Development mode

To run your project in development mode, run:

```bash
npm run watch
```

The development site will be available at [http://localhost:4103](http://localhost:4103).

#### Production Mode

It's sometimes useful to run a project in production mode, for example, to check bundle size or to debug a production-only issue. To run your project in production mode locally, run:

```bash
npm run build-production
NODE_ENV=production npm run start
```

#### NPM scripts

- `npm run test`: test the whole project and generate a test coverage
- `npm run ava ./path/to/test-file.js`: run a specific test file
- `npm run build`: build source code from `src` to `dist`
- `npm run lint`: run the linter
- `npm run kill`: kill the node server occupying the port 4103.
