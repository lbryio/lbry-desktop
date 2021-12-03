import visit from 'unist-util-visit';

const TIMESTAMP_NODE_TYPE = 'timestamp';

// ***************************************************************************
// Tokenize timestamp
// ***************************************************************************

function findNextTimestamp(value, fromIndex, strictlyFromIndex) {
  let begin = 0;
  while (begin < value.length) {
    // Start with a rough match
    const match = value.substring(begin).match(/[0-9:]+/);

    if (!match) {
      return null;
    }

    // Compensate 'substring' index. 'match.index' is relative to 'value' from now on.
    match.index += begin;

    if (strictlyFromIndex && match.index !== fromIndex) {
      if (match.index > fromIndex) {
        // Already gone past desired index. Skip the rest.
        return null;
      } else {
        // Next match might fit 'fromIndex'.
        begin = match.index + match[0].length;
        continue;
      }
    }

    if (fromIndex > 0 && fromIndex >= match.index && fromIndex < match.index + match[0].length) {
      // Skip previously-rejected word, preventing "62:01" from being tokenized as "2:01", for example.
      // This assumes that a non-zero 'fromIndex' means that a previous lookup has failed.
      begin = match.index + match[0].length;
      continue;
    }

    // Exclude trailing colons to allow "0:12: Start of section", for example.
    const str = match[0].replace(/:+$/, '');

    let isValidTimestamp;
    switch (str.length) {
      case 4: // "9:59"
        isValidTimestamp = /^[0-9]:[0-5][0-9]$/.test(str);
        break;
      case 5: // "59:59"
        isValidTimestamp = /^[0-5][0-9]:[0-5][0-9]$/.test(str);
        break;
      case 7: // "9:59:59"
        isValidTimestamp = /^[0-9]:[0-5][0-9]:[0-5][0-9]$/.test(str);
        break;
      case 8: // "99:59:59"
        isValidTimestamp = /^[0-9][0-9]:[0-5][0-9]:[0-5][0-9]$/.test(str);
        break;
      default:
        // Reject
        isValidTimestamp = false;
        break;
    }

    if (isValidTimestamp) {
      // Profit!
      return {
        text: str,
        index: match.index,
      };
    }

    if (strictlyFromIndex && match.index >= fromIndex) {
      return null; // Since it failed and we've gone past the desired index, skip the rest.
    }

    begin = match.index + match[0].length;
  }

  return null;
}

function locateTimestamp(value, fromIndex) {
  const ts = findNextTimestamp(value, fromIndex, false);
  return ts ? ts.index : -1;
}

// Generate 'timestamp' markdown node
const createTimestampNode = (text) => ({
  type: TIMESTAMP_NODE_TYPE,
  value: text,
  children: [{ type: 'text', value: text }],
});

// Generate a markdown link from timestamp
function tokenizeTimestamp(eat, value, silent) {
  if (silent) {
    return true;
  }

  const ts = findNextTimestamp(value, 0, true);
  if (ts) {
    try {
      const text = ts.text;
      return eat(text)(createTimestampNode(text));
    } catch (err) {
      // Do nothing
    }
  }
}

tokenizeTimestamp.locator = locateTimestamp;
tokenizeTimestamp.notInList = false; // Flag doesn't work? It'll always tokenizes in List and never in Bullet.
tokenizeTimestamp.notInLink = true;
tokenizeTimestamp.notInBlock = false;

export function inlineTimestamp() {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  // Add an inline tokenizer (defined in the following example).
  tokenizers.timestamp = tokenizeTimestamp;

  // Run it just before `text`.
  methods.splice(methods.indexOf('text'), 0, 'timestamp');
}

// ***************************************************************************
// Format timestamp
// ***************************************************************************

function strToSeconds(stime) {
  const tt = stime.split(':').reverse();
  return (tt.length >= 3 ? +tt[2] : 0) * 60 * 60 + (tt.length >= 2 ? +tt[1] : 0) * 60 + (tt.length >= 1 ? +tt[0] : 0);
}

const transformer = (node, index, parent) => {
  if (node.type === TIMESTAMP_NODE_TYPE && parent && parent.type === 'paragraph') {
    const timestampStr = node.value;
    const seconds = strToSeconds(timestampStr);

    node.type = 'link';
    node.url = `?t=${seconds}`;
    node.title = timestampStr;
    node.children = [{ type: 'text', value: timestampStr }];
  }
};

const transform = (tree) => {
  visit(tree, [TIMESTAMP_NODE_TYPE], transformer);
};

export const formattedTimestamp = () => transform;
