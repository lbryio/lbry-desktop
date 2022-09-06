// @flow
import { isLocalStorageAvailable } from 'util/storage';

const isProduction = process.env.NODE_ENV === 'production';
const localStorageAvailable = isLocalStorageAvailable();

window.i18n_messages = window.i18n_messages || {};
let reportTimer;

/**
 * Collects new i18n strings encountered during runtime.
 * The output can be retrieved and pasted into app-strings.json.
 *
 * @param message
 */
function saveMessageWeb(message) {
  // @if process.env.NODE_ENV!='production'
  if (!window.app_strings) {
    return;
  }

  if (!window.new_strings) {
    console.log('Copy new i18n to clipboard:%c copy(window.new_strings)', 'color:yellow'); // eslint-disable-line
  }

  window.new_strings = window.new_strings || {};

  if (!window.app_strings[message] && !window.new_strings[message]) {
    window.new_strings[message] = removeContextMetadata(message);

    // @if REPORT_NEW_STRINGS='true'
    if (reportTimer) clearTimeout(reportTimer);
    reportTimer = setTimeout(() => console.log(window.new_strings), 2000); // eslint-disable-line no-console
    // @endif
  }
  // @endif
}

function removeContextMetadata(message) {
  // Example string entries with context-metadata:
  //   "About --[About section in Help Page]--": "About",
  //   "About --[tab title in Channel Page]--": "About",
  const CONTEXT_BEGIN = '--[';
  const CONTEXT_FINAL = ']--';

  // If the resolved string still contains the context-metadata, then it's one of the following:
  // 1. In development mode, where 'en.json' in the server hasn't been updated with the string yet.
  // 2. Translator made a mistake of not ignoring the context string.
  // In either case, we'll revert to the English version.

  const begin = message.lastIndexOf(CONTEXT_BEGIN);
  if (begin > 0 && message.endsWith(CONTEXT_FINAL)) {
    // Strip away context:
    message = message.substring(0, begin);
    // No trailing spaces should be allowed in the string database anyway, because that is hard to translate
    // (can't see in Transifex; might not make sense in other languages; etc.).
    // With that, we can add a space before the context-metadata to make it neat, and trim both cases here:
    message = message.trimEnd();
  }

  return message;
}

export function __(message: string, tokens: { [string]: string }) {
  if (!message) {
    return '';
  }

  const language = localStorageAvailable
    ? window.localStorage.getItem('language') || 'en'
    : window.navigator.language.slice(0, 2) || 'en';

  if (!isProduction) {
    saveMessageWeb(message);
  }

  let translatedMessage = window.i18n_messages[language] ? window.i18n_messages[language][message] || message : message;
  translatedMessage = removeContextMetadata(translatedMessage);

  if (!tokens) {
    return translatedMessage;
  }

  return translatedMessage.replace(/%([^%]+)%/g, ($1, $2) => {
    return tokens.hasOwnProperty($2) ? tokens[$2] : $2;
  });
}
