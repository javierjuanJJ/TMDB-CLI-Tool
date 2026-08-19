const { ENDPOINT_BY_TYPE } = require('../consts/api.js');
const { MESSAGES, TYPE_TITLES } = require('../consts/messages.js');

const TYPE_FLAG = '--type';

function parseArguments(argv) {
  const typeIndex = argv.indexOf(TYPE_FLAG);

  if (typeIndex === -1) {
    throw new Error(MESSAGES.missingType);
  }

  const rawType = argv[typeIndex + 1];
  if (!rawType || rawType.startsWith('--')) {
    throw new Error(MESSAGES.missingType);
  }

  const type = rawType.toLowerCase();
  const validTypes = Object.keys(ENDPOINT_BY_TYPE);

  if (!validTypes.includes(type)) {
    throw new Error(MESSAGES.invalidType(validTypes));
  }

  return {
    type,
    typeTitle: TYPE_TITLES[type],
  };
}

module.exports = {
  parseArguments,
};