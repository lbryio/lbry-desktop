import visit from 'unist-util-visit';

const TIMESTAMP_NODE_TYPE = 'timestamp';
const TIMESTAMP_REGEX = /(?<!\d|:)([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?(?!\d|:)/g;

// ***************************************************************************
// Tokenize timestamp
// ***************************************************************************

function locateTimestamp(value, fromIndex) {
  const timestamps = Array.from(value.matchAll(TIMESTAMP_REGEX));
  return timestamps.length === 0 ? -1 : timestamps[0].index;
}

// Generate 'timestamp' markdown node
const createTimestampNode = text => ({
  type: TIMESTAMP_NODE_TYPE,
  value: text,
  children: [{ type: 'text', value: text }],
});

// Generate a markdown link from timestamp
function tokenizeTimestamp(eat, value, silent) {
  if (silent) {
    return true;
  }

  const match = value.match(TIMESTAMP_REGEX);
  if (match) {
    try {
      const text = match[0];
      return eat(text)(createTimestampNode(text));
    } catch (err) {
      // Do nothing
    }
  }
}

tokenizeTimestamp.locator = locateTimestamp;
tokenizeTimestamp.notInList = true;
tokenizeTimestamp.notInLink = true;
tokenizeTimestamp.notInBlock = true;

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

const transform = tree => {
  visit(tree, [TIMESTAMP_NODE_TYPE], transformer);
};

export const formattedTimestamp = () => transform;
