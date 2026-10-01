const ERROR_PREFIX = '[ERROR]';

const CLI_NAME = 'tmdb-cli';

const MESSAGES = {
  missingType: 'Missing required flag: --type <value>. Example: --type "playing". Run with --help to see the usage.',
  missingApiKey: 'TMDB_API_KEY environment variable is not set. Set it before running the app. Example: TMDB_API_KEY=your_key node app.js --type "playing".',
  invalidType: (validTypes) =>
    `Invalid --type value. Valid values are: ${validTypes.join(', ')}. Example: --type "playing".`,
  unknownFlag: (flag) =>
    `Unknown option: ${flag}. Supported options are: --type <value>, --help, --version. Run with --help to see the usage.`,
  unexpectedArgument: (value) =>
    `Unexpected argument: ${value}. This command only accepts options, no positional arguments. Run with --help to see the usage.`,
  networkError: (cause) => `Network error while reaching TMDB API: ${cause.message}`,
  httpError: (status, statusText, detail, url) =>
    `TMDB API responded with HTTP ${status} (${statusText}).${detail ? ` Detail: ${detail}` : ''} URL: ${url}`,
  invalidResponse: 'TMDB API returned an unexpected or empty response.',
};

const TYPE_TITLES = {
  playing: 'NOW PLAYING MOVIES',
  popular: 'POPULAR MOVIES',
  top: 'TOP RATED MOVIES',
  upcoming: 'UPCOMING MOVIES',
};

function versionLine(version) {
  return `${CLI_NAME} v${version}`;
}

function helpText(version, validTypes) {
  const listings = validTypes
    .map((type) => `  ${TYPE_TITLES[type].padEnd(21)} --type ${type}`)
    .join('\n');

  return [
    `${versionLine(version)} — List movies from The Movie Database straight into your terminal.`,
    '',
    'USAGE',
    '  node app.js --type <value>',
    '  tmdb-app    --type <value>',
    '',
    'OPTIONS',
    '  --type <value>   Listing to query. Required. Also accepts --type=<value>.',
    '  --help, -h       Show this help and exit with code 0.',
    '  --version, -v    Show the version and exit with code 0.',
    '',
    'ENVIRONMENT',
    '  TMDB_API_KEY     Required. TMDB API Key (v3 auth) bearer token.',
    '',
    'LISTINGS',
    listings,
    '',
    'EXAMPLES',
    '  export TMDB_API_KEY="your_api_key_here"',
    '  node app.js --type popular',
    '  node app.js --type top | sed \'s/\\x1b\\[[0-9;]*m//g\'',
    '',
    'Errors are printed to stderr prefixed with [ERROR] and always exit with code 1.',
  ].join('\n');
}

module.exports = {
  ERROR_PREFIX,
  CLI_NAME,
  MESSAGES,
  TYPE_TITLES,
  versionLine,
  helpText,
};