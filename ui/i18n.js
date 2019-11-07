// @if TARGET='app'
let fs = require('fs');
// @endif

const isProduction = process.env.NODE_ENV === 'production';
let knownMessages = null;

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
    knownMessages[message] = message;
    fs.writeFile(messagesFilePath, JSON.stringify(knownMessages, null, 2), 'utf-8', err => {
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
  const language = window.localStorage.getItem('language') || 'en';

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
    return tokens[$2] || $2;
  });
}
