import { parseURI } from 'lbry-redux';
import visit from 'unist-util-visit';

const protocol = 'lbry://';
const locateURI = (value, fromIndex) => value.indexOf(protocol, fromIndex);
const locateMention = (value, fromIndex) => value.indexOf('@', fromIndex);

// Generate a valid markdown link
const createURI = (text, uri, embed = false) => ({
  type: 'link',
  url: (uri.startsWith(protocol) ? '' : protocol) + uri,
  data: {
    // Custom attribute
    hProperties: { embed },
  },
  children: [{ type: 'text', value: text }],
});

const validateURI = (match, eat) => {
  if (match) {
    try {
      const text = match[0];
      const uri = parseURI(text);
      const isValid = uri && uri.claimName;
      const isChannel = uri.isChannel && !uri.path;

      if (isValid) {
        // Create channel link
        if (isChannel) {
          return eat(text)(createURI(uri.claimName, text, false));
        }
        // Create claim link
        return eat(text)(createURI(text, text, true));
      }
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
tokenizeURI.notInList = true;
tokenizeURI.notInLink = true;
tokenizeURI.notInBlock = true;

// Configure tokenizer for lbry channels
tokenizeMention.locator = locateMention;
tokenizeMention.notInList = true;
tokenizeMention.notInLink = true;
tokenizeMention.notInBlock = true;

const visitor = (node, index, parent) => {
  if (node.type === 'link' && parent && parent.type === 'paragraph') {
    try {
      const uri = parseURI(node.url);
      const isValid = uri && uri.claimName;
      const isChannel = uri.isChannel && !uri.path;
      if (isValid && !isChannel) {
        if (!node.data || !node.data.hProperties) {
          // Create new node data
          node.data = {
            hProperties: { embed: true },
          };
        } else if (node.data.hProperties) {
          // Don't overwrite current attributes
          node.data.hProperties = {
            embed: true,
            ...node.data.hProperties,
          };
        }
      }
    } catch (err) {
      // Silent errors: console.error(err)
    }
  }
};

// transform
const transform = tree => {
  visit(tree, ['link'], visitor);
};

export const formatedLinks = () => transform;

// Main module
export function inlineLinks() {
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
