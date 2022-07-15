import { EMOTES_48px as EMOTES } from 'constants/emotes';
import visit from 'unist-util-visit';

const EMOTE_NODE_TYPE = 'emote';
const RE_EMOTE = /:\+1:|:-1:|:[\w-]+:/;

// ***************************************************************************
// Tokenize emote
// ***************************************************************************

function findNextEmote(value, fromIndex, strictlyFromIndex) {
  let begin = 0;

  while (begin < value.length) {
    const match = value.substring(begin).match(RE_EMOTE);

    if (!match) return null;

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

    if (fromIndex > 0 && fromIndex > match.index && fromIndex < match.index + match[0].length) {
      // Skip previously-rejected word
      // This assumes that a non-zero 'fromIndex' means that a previous lookup has failed.
      begin = match.index + match[0].length;
      continue;
    }

    const str = match[0];

    if (EMOTES.some(({ name }) => str === name)) {
      // Profit!
      return { text: str, index: match.index };
    }

    if (strictlyFromIndex && match.index >= fromIndex) {
      return null; // Since it failed and we've gone past the desired index, skip the rest.
    }

    begin = match.index + match[0].length;
  }

  return null;
}

function locateEmote(value, fromIndex) {
  const emote = findNextEmote(value, fromIndex, false);
  return emote ? emote.index : -1;
}

// Generate 'emote' markdown node
const createEmoteNode = (text) => ({
  type: EMOTE_NODE_TYPE,
  value: text,
  children: [{ type: 'text', value: text }],
});

// Generate a markdown image from emote
function tokenizeEmote(eat, value, silent) {
  if (silent) return true;

  const emote = findNextEmote(value, 0, true);
  if (emote) {
    try {
      const text = emote.text;
      return eat(text)(createEmoteNode(text));
    } catch (e) {}
  }
}

tokenizeEmote.locator = locateEmote;

export function inlineEmote() {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  // Add an inline tokenizer (defined in the following example).
  tokenizers.emote = tokenizeEmote;

  // Run it just before `text`.
  methods.splice(methods.indexOf('text'), 0, 'emote');
}

// ***************************************************************************
// Format emote
// ***************************************************************************

const transformer = (node, index, parent) => {
  if (node.type === EMOTE_NODE_TYPE && parent && parent.type === 'paragraph') {
    const emoteStr = node.value;
    const emote = EMOTES.find(({ name }) => emoteStr === name);

    node.type = 'image';
    node.url = emote.url;
    node.title = emoteStr;
    node.children = [{ type: 'text', value: emoteStr }];
    if (!node.data || !node.data.hProperties) {
      // Create new node data
      node.data = {
        hProperties: { emote: true },
      };
    } else if (node.data.hProperties) {
      // Don't overwrite current attributes
      node.data.hProperties = {
        emote: true,
        ...node.data.hProperties,
      };
    }
  }
};

const transform = (tree) => visit(tree, [EMOTE_NODE_TYPE], transformer);

export const formattedEmote = () => transform;
