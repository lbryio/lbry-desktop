import { parseURI } from "util/lbryURI";
import visit from "unist-util-visit";
import type { MdNode, Eat } from "util/remark-types";

const protocol = "lbry://";
const uriRegex = /(lbry:\/\/)[^\s"]*[^)]/g;
export const punctuationMarks = [",", ".", "!", "?", ":", ";", "-", "]", ")", "}"] as const;

const mentionToken = "@";

const invalidRegex = /[-_.+=?!@#$%^&*:;,{}<>\w/\\]/;
const mentionRegex = /@[^\s()"-_.+=?!@$%^&*;,{}<>/\\]*/gm;

function handlePunctuation(value: string): string {
  const protocolIndex = value.indexOf("lbry://") === 0 ? protocol.length - 1 : 0;
  const channelModifierIndex =
    (value.indexOf(":", protocolIndex) >= 0 && value.indexOf(":", protocolIndex)) ||
    (value.indexOf("#", protocolIndex) >= 0 && value.indexOf("#", protocolIndex));
  const claimModifierIndex =
    (value.indexOf(":", channelModifierIndex + 1) >= 0 && value.indexOf(":", channelModifierIndex + 1)) ||
    (value.indexOf("#", channelModifierIndex + 1) >= 0 && value.indexOf("#", channelModifierIndex + 1)) ||
    channelModifierIndex;

  let punctuationIndex: number | false;
  punctuationMarks.some((p) => {
    if (claimModifierIndex) {
      punctuationIndex = value.indexOf(p, claimModifierIndex + 1) >= 0 && value.indexOf(p, claimModifierIndex + 1);
    }
    return punctuationIndex;
  });

  return punctuationIndex ? value.substring(0, punctuationIndex) : value;
}

// Find channel mention
function locateMention(value: string, fromIndex: number): number {
  const index = value.indexOf(mentionToken, fromIndex);

  // Skip invalid mention
  if (index > 0 && invalidRegex.test(value.charAt(index - 1))) {
    return locateMention(value, index + 1);
  }

  return index;
}

// Find claim url
function locateURI(value: string, fromIndex: number): number {
  const index = value.indexOf(protocol, fromIndex);

  // Skip invalid uri
  if (index > 0 && invalidRegex.test(value.charAt(index - 1))) {
    return locateMention(value, index + 1);
  }

  return index;
}

// Generate a valid markdown link
const createURI = (text: string, uri: string, embed = false): MdNode => ({
  type: "link",
  url: (uri.startsWith(protocol) ? "" : protocol) + uri,
  data: {
    // Custom attribute
    hProperties: { embed },
  },
  children: [{ type: "text", value: text }],
});

const validateURI = (match: string[] | null, eat: Eat): unknown => {
  if (match) {
    try {
      const text = match[0];
      const newText = handlePunctuation(text);
      const uri = parseURI(newText);
      const isValid = uri && uri.claimName;
      const isChannel = uri.isChannel && uri.path === uri.claimName;

      if (isValid) {
        // Create channel link
        if (isChannel) {
          return eat(newText)(createURI(uri.claimName, newText, false));
        }
        // Create claim link
        return eat(newText)(createURI(newText, newText, true));
      }
    } catch (err: any) {
      // Silent errors: console.error(err)
    }
  }
};

// Generate a markdown link from channel name
function tokenizeMention(eat: Eat, value: string, silent: boolean): unknown {
  if (silent) {
    return true;
  }

  const match = value.match(mentionRegex);

  // @ts-expect-error - TS2554 - validateURI takes two arguments; the extra `self` is ignored
  return validateURI(match, eat, self);
}

// Generate a markdown link from lbry url
function tokenizeURI(eat: Eat, value: string, silent: boolean): unknown {
  if (silent) {
    return true;
  }

  const match = value.match(uriRegex);

  return validateURI(match, eat);
}

// Configure tokenizer for lbry urls
tokenizeURI.locator = locateURI;
tokenizeURI.notInList = false;
tokenizeURI.notInLink = true;
tokenizeURI.notInBlock = false;

// Configure tokenizer for lbry channels
tokenizeMention.locator = locateMention;
tokenizeMention.notInList = false;
tokenizeMention.notInLink = true;
tokenizeMention.notInBlock = false;

const visitor = (node: MdNode, index: number, parent: MdNode | undefined): void => {
  if (node.type === "link" && parent && parent.type === "paragraph") {
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
    } catch (err: any) {
      // Silent errors: console.error(err)
    }
  }
};

// transform
const transform = (tree: MdNode): void => {
  visit(tree, ["link"], visitor);
};

export const formattedLinks = (): ((tree: MdNode) => void) => transform;

// Main module
export function inlineLinks(): void {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  // Add an inline tokenizer (defined in the following example).
  tokenizers.uri = tokenizeURI;
  tokenizers.mention = tokenizeMention;

  // Run it just before `text`.
  methods.splice(methods.indexOf("text"), 0, "uri");
  methods.splice(methods.indexOf("text"), 0, "mention");
}
