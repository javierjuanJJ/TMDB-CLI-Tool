const ERROR_PREFIX = '[ERROR]';

const MESSAGES = {
  missingType: 'Missing required flag: --type <value>. Example: --type "playing".',
  missingApiKey: 'TMDB_API_KEY environment variable is not set. Set it before running the app. Example: TMDB_API_KEY=your_key node app.js --type "playing".',
  invalidType: (validTypes) =>
    `Invalid --type value. Valid values are: ${validTypes.join(', ')}. Example: --type "playing".`,
  networkError: (cause) => `Network error while reaching TMDB API: ${cause.message}`,
  httpError: (status, statusText, detail, url) =>
    `TMDB API responded with HTTP ${status} (${statusText}).${detail ? ` Detail: ${detail}` : ''} URL: ${url}`,
  invalidResponse: 'TMDB API returned an unexpected or empty response.',
};

const TYPE_TITLES = {
  playing: 'NOW PLAYING MOVIES',
  popular: 'POPULAR MOVIES',
  top: 'TOP RATED MOVIES',
};

module.exports = {
  ERROR_PREFIX,
  MESSAGES,
  TYPE_TITLES,
};