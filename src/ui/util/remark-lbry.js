import { parseURI } from 'lbry-redux';
import visit from 'unist-util-visit';
import wordCharacter from 'is-word-character';

const protocol = 'lbry://';
const uriRegex = /^(lbry:\/\/)[^\s]*/g;

const mentionToken = '@';
const mentionTokenCode = 64; // @
const mentionRegex = /^@[^\s()]*/gm;

function invalidChar(char) {
  const dot = 46; //  '.'
  const dash = 45; //  '-'
  const slash = 47; //  '/'

  return char === dot || char === dash || char === slash || char === mentionTokenCode || wordCharacter(char);
}

// Find a possible mention.
function locateMention(value, fromIndex) {
  var index = value.indexOf(mentionToken, fromIndex);

  if (index !== -1 && invalidChar(value.charCodeAt(index - 1))) {
    return locateMention(value, index + 1);
  }

  return index;
}

function locateURI(value, fromIndex) {
  var index = value.indexOf(protocol, fromIndex);

  if (index !== -1 && invalidChar(value.charCodeAt(index - 1))) {
    return locateMention(value, index + 1);
  }

  return index;
}

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

const validateURI = (match, eat, self) => {
  if (match) {
    try {
      const text = match[0];
      const uri = parseURI(text);
      const isValid = uri && uri.claimName;
      const isChannel = uri.isChannel && uri.path === uri.claimName;

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
  if (silent) {
    return true;
  }

  if (value.charCodeAt(0) !== mentionTokenCode) {
    return;
  }

  const match = value.match(mentionRegex);

  return validateURI(match, eat, self);
}

// Generate a markdown link from lbry url
function tokenizeURI(eat, value, silent) {
  if (silent) {
    return true;
  }

  if (!value.startsWith(protocol)) {
    return;
  }

  const match = value.match(uriRegex);

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
      const isChannel = uri.isChannel && uri.path === uri.claimName;
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
