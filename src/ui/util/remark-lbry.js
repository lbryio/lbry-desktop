import { parseURI } from 'lbry-redux';

const protocol = 'lbry://';
const locateURI = (value, fromIndex) => value.indexOf(protocol, fromIndex);
const locateMention = (value, fromIndex) => value.indexOf('@', fromIndex);

// Generate a valid markdown link
const createURI = (text, uri) => ({
  type: 'link',
  url: (uri.startsWith(protocol) ? '' : protocol) + uri,
  children: [{ type: 'text', value: text }],
});

const validateURI = (match, eat) => {
  if (match) {
    try {
      const text = match[0];
      const uri = parseURI(text);
      // Create channel link
      if (uri.isChannel && !uri.path) {
        return eat(text)(createURI(uri.claimName, text));
      }
      // Create uri link
      return eat(text)(createURI(text, text));
    } catch (err) {
      // Silent errors: console.error(err)
    }
  }
};

// Generate a markdown link from channel name
function tokenizeMention(eat, value, silent) {
  const match = /^@+[a-zA-Z0-9-#:/]+/.exec(value);
  return validateURI(match, eat);
}

// Generate a markdown link from lbry url
function tokenizeURI(eat, value, silent) {
  const match = /^(lbry:\/\/)+[a-zA-Z0-9-@#:/]+/.exec(value);
  return validateURI(match, eat);
}

// Configure tokenizer for lbry urls
tokenizeURI.locator = locateURI;
tokenizeURI.notInLink = true;
tokenizeURI.notInBlock = true;

// Configure tokenizer for lbry channels
tokenizeMention.locator = locateMention;
tokenizeMention.notInLink = true;
tokenizeMention.notInBlock = true;

// Main module
export default function remarkLBRY() {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  // Add an inline tokenizer (defined in the following example).
  tokenizers.uri = tokenizeURI;
  tokenizers.mention = tokenizeMention;

  // Run it just before `text`.
  methods.splice(methods.indexOf('text'), 0, 'uri');
  methods.splice(methods.indexOf('text'), 0, 'mention');
}
