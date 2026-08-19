const { BASE_URL, API_KEY_ENV_VAR, DEFAULT_LANGUAGE, DEFAULT_PAGE, ENDPOINT_BY_TYPE } = require('../consts/api.js');
const { MESSAGES } = require('../consts/messages.js');

const REQUEST_HEADERS = {
  accept: 'application/json',
};

function resolveEndpoint(type) {
  const endpoint = ENDPOINT_BY_TYPE[type];
  if (!endpoint) {
    throw new Error(MESSAGES.invalidType(Object.keys(ENDPOINT_BY_TYPE)));
  }
  return endpoint;
}

function detectStatusCode(context) {
  try {
    return JSON.parse(context.body).status_message;
  } catch (err) {
    return undefined;
  }
}

async function fetchMovies(type) {
  const apiKey = process.env[API_KEY_ENV_VAR];
  if (!apiKey) {
    throw new Error(MESSAGES.missingApiKey);
  }

  const endpoint = resolveEndpoint(type);
  const url = `${BASE_URL}${endpoint}?language=${encodeURIComponent(DEFAULT_LANGUAGE)}&page=${DEFAULT_PAGE}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        ...REQUEST_HEADERS,
        Authorization: `Bearer ${apiKey}`,
      },
    });
  } catch (cause) {
    throw new Error(MESSAGES.networkError(cause));
  }

  if (!response.ok) {
    const rawBody = await response.text().catch(() => '');
    const statusMessage = detectStatusCode(rawBody);
    throw new Error(MESSAGES.httpError(response.status, response.statusText, statusMessage, url));
  }

  const payload = await response.json().catch(() => null);
  if (!payload || !Array.isArray(payload.results)) {
    throw new Error(MESSAGES.invalidResponse);
  }

  return payload.results;
}

module.exports = {
  fetchMovies,
};