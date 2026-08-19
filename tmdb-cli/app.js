const { parseArguments } = require('./lib/args.js');
const { fetchMovies } = require('./lib/api.js');
const { displayMovies } = require('./lib/formatter.js');
const { ERROR_PREFIX, MESSAGES } = require('./consts/messages.js');
const { API_KEY_ENV_VAR } = require('./consts/api.js');

const apiKey = process.env[API_KEY_ENV_VAR];
if (!apiKey) {
  console.error(`${ERROR_PREFIX} ${MESSAGES.missingApiKey}`);
  process.exit(1);
}

let args;
try {
  args = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(`${ERROR_PREFIX} ${error.message}`);
  process.exit(1);
}

fetchMovies(args.type)
  .then((movies) => displayMovies(movies, args.typeTitle))
  .catch((error) => {
    console.error(`${ERROR_PREFIX} ${error.message}`);
    process.exit(1);
  });