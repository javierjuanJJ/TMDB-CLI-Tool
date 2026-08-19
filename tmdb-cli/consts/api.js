const BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY_ENV_VAR = 'TMDB_API_KEY';

const DEFAULT_LANGUAGE = 'en-US';

const DEFAULT_PAGE = 1;

const ENDPOINT_BY_TYPE = {
  playing: '/movie/now_playing',
};

module.exports = {
  BASE_URL,
  API_KEY_ENV_VAR,
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE,
  ENDPOINT_BY_TYPE,
};