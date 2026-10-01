const { ENDPOINT_BY_TYPE } = require('../consts/api.js');
const { MESSAGES, TYPE_TITLES } = require('../consts/messages.js');

const TYPE_FLAG = '--type';
const TYPE_ASSIGNMENT = `${TYPE_FLAG}=`;
const HELP_FLAGS = ['--help', '-h'];
const VERSION_FLAGS = ['--version', '-v'];

function isFlag(token) {
  return typeof token === 'string' && token.length > 1 && token.startsWith('-');
}

function detectAction(argv) {
  if (argv.some((token) => HELP_FLAGS.includes(token))) {
    return 'help';
  }
  if (argv.some((token) => VERSION_FLAGS.includes(token))) {
    return 'version';
  }
  return 'list';
}

function readType(argv) {
  let rawType;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === TYPE_FLAG) {
      const value = argv[index + 1];
      if (rawType === undefined) {
        if (!value || isFlag(value)) {
          throw new Error(MESSAGES.missingType);
        }
        rawType = value;
      }
      index += 1;
      continue;
    }

    if (token.startsWith(TYPE_ASSIGNMENT)) {
      if (rawType === undefined) {
        const value = token.slice(TYPE_ASSIGNMENT.length);
        if (!value) {
          throw new Error(MESSAGES.missingType);
        }
        rawType = value;
      }
      continue;
    }

    if (isFlag(token)) {
      throw new Error(MESSAGES.unknownFlag(token));
    }

    throw new Error(MESSAGES.unexpectedArgument(token));
  }

  return rawType;
}

function parseArguments(argv) {
  const args = Array.isArray(argv) ? argv : [];

  const action = detectAction(args);
  if (action !== 'list') {
    return { action };
  }

  const rawType = readType(args);
  if (rawType === undefined) {
    throw new Error(MESSAGES.missingType);
  }

  const type = rawType.toLowerCase();
  const validTypes = Object.keys(ENDPOINT_BY_TYPE);

  if (!validTypes.includes(type)) {
    throw new Error(MESSAGES.invalidType(validTypes));
  }

  return {
    action,
    type,
    typeTitle: TYPE_TITLES[type],
  };
}

module.exports = {
  parseArguments,
};