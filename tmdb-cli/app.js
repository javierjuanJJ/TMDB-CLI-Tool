#!/usr/bin/env node

const { parseArguments } = require('./lib/args.js');
const { fetchMovies } = require('./lib/api.js');
const { displayMovies } = require('./lib/formatter.js');
const { ERROR_PREFIX, MESSAGES, helpText, versionLine } = require('./consts/messages.js');
const { API_KEY_ENV_VAR, ENDPOINT_BY_TYPE } = require('./consts/api.js');
const { version } = require('./package.json');

let args;
try {
  args = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(`${ERROR_PREFIX} ${error.message}`);
  process.exit(1);
}

if (args.action === 'help') {
  console.log(helpText(version, Object.keys(ENDPOINT_BY_TYPE)));
  process.exit(0);
}

if (args.action === 'version') {
  console.log(versionLine(version));
  process.exit(0);
}

if (!process.env[API_KEY_ENV_VAR]) {
  console.error(`${ERROR_PREFIX} ${MESSAGES.missingApiKey}`);
  process.exit(1);
}

fetchMovies(args.type)
  .then((movies) => displayMovies(movies, args.typeTitle))
  .catch((error) => {
    console.error(`${ERROR_PREFIX} ${error.message}`);
    process.exit(1);
  });