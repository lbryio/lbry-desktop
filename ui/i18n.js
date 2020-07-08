// @if TARGET='app'
let fs = require('fs');
// @endif

const isProduction = process.env.NODE_ENV === 'production';
let knownMessages = null;
let localStorageAvailable;
try {
  localStorageAvailable = Boolean(window.localStorage);
} catch (e) {
  localStorageAvailable = false;
}

window.i18n_messages = window.i18n_messages || {};

// @if TARGET='app'
function saveMessage(message) {
  const messagesFilePath = __static + '/app-strings.json';

  if (knownMessages === null) {
    try {
      knownMessages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
    } catch (err) {
      throw 'Error parsing i18n messages file: ' + messagesFilePath + ' err: ' + err;
    }
  }

  if (!knownMessages[message]) {
    const END = '--end--';
    delete knownMessages[END];
    knownMessages[message] = message;
    knownMessages[END] = END;

    fs.writeFile(messagesFilePath, JSON.stringify(knownMessages, null, 2) + '\n', 'utf-8', err => {
      if (err) {
        throw err;
      }
    });
  }
}
// @endif

/*
 I dislike the below code (and note that it ships all the way to the distributed app),
 but this seems better than silently having this limitation and future devs not knowing.
 */
// @if TARGET='web'
function saveMessage(message) {
  if (!isProduction && knownMessages === null) {
    console.log('Note that i18n messages are not saved in web dev mode.');
    knownMessages = {};
  }
}
// @endif

export function __(message, tokens) {
  const language = localStorageAvailable
    ? window.localStorage.getItem('language') || 'en'
    : window.navigator.language.slice(0, 2) || 'en';

  if (!isProduction) {
    saveMessage(message);
  }

  const translatedMessage = window.i18n_messages[language]
    ? window.i18n_messages[language][message] || message
    : message;

  if (!tokens) {
    return translatedMessage;
  }

  return translatedMessage.replace(/%([^%]+)%/g, function($1, $2) {
    return tokens.hasOwnProperty($2) ? tokens[$2] : $2;
  });
}
