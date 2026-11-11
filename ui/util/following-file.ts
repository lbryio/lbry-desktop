// Reading and writing the file used to export and import followed channels.
//
// Export writes JSON:
//   {
//     "type": "lbry-following",
//     "version": 1,
//     "following": [{ "uri": "lbry://@name#<claim id>", "channelName": "@name", "notificationsDisabled": true }]
//   }
//
// Import also accepts a JSON array of URLs or of { uri } objects, an object with a `following` or
// `subscriptions` array, or plain text with one channel per line. Lines starting with "#" are comments.
// A channel can be written as lbry://@name#id, @name#id, @name:id, or a web link such as
// https://odysee.com/@name:id. Links to content in a channel import that channel.
import { parseURI, buildURI } from "util/lbryURI";

export const FOLLOWING_FILE_TYPE = "lbry-following";
export const FOLLOWING_FILE_VERSION = 1;
export const FOLLOWING_IMPORT_MAX = 5000;

const FULL_CLAIM_ID = /^[0-9a-f]{40}$/;

export type FollowingEntry = {
  uri: string;
  channelName: string;
  notificationsDisabled: boolean;
  position: number; // where the channel was in the file
};

export type ParsedFollowingFile = {
  // Channels with a full claim ID, ready to follow.
  entries: Array<FollowingEntry>;
  // Channels given by name or short claim ID. They have to be resolved to find the channel.
  unresolved: Array<{
    uri: string;
    notificationsDisabled: boolean;
    position: number;
  }>;
  // Lines or items that aren't channel URLs, as written in the file.
  invalid: Array<string>;
};

export function buildFollowingFile(subscriptions: Array<Subscription>, following: Array<Following>): string {
  const notificationsDisabled: Record<string, any> = {};
  following.forEach((f) => {
    const id = claimIdOf(f.uri);
    if (id) notificationsDisabled[id] = f.notificationsDisabled;
  });

  return JSON.stringify(
    {
      type: FOLLOWING_FILE_TYPE,
      version: FOLLOWING_FILE_VERSION,
      following: subscriptions.map((sub) => {
        const id = claimIdOf(sub.uri);
        return {
          uri: sub.uri,
          channelName: sub.channelName,
          notificationsDisabled: id && id in notificationsDisabled ? notificationsDisabled[id] : true,
        };
      }),
    },
    null,
    2
  );
}

export function parseFollowingFile(text: string): ParsedFollowingFile {
  const items = readItems(text);
  if (items.length > FOLLOWING_IMPORT_MAX) {
    throw new Error(__("This file lists more than %max% channels.", { max: FOLLOWING_IMPORT_MAX }));
  }

  const result: ParsedFollowingFile = { entries: [], unresolved: [], invalid: [] };
  const seen = new Set();

  items.forEach(({ raw, notificationsDisabled }, position) => {
    const channel = parseChannelUrl(raw);
    if (!channel) {
      result.invalid.push(raw);
      return;
    }

    const { channelName, channelClaimId } = channel;
    const uri = buildURI({ channelName, channelClaimId });
    const hasFullClaimId = isFullClaimId(channelClaimId);
    const key = hasFullClaimId && channelClaimId ? channelClaimId : uri;
    if (seen.has(key)) return;
    seen.add(key);

    if (hasFullClaimId) {
      result.entries.push({ uri, channelName: `@${channelName}`, notificationsDisabled, position });
    } else {
      result.unresolved.push({ uri, notificationsDisabled, position });
    }
  });

  return result;
}

export function isFullClaimId(claimId?: string | null): boolean {
  return Boolean(claimId && FULL_CLAIM_ID.test(claimId));
}

function claimIdOf(uri: string): string | null | undefined {
  const channel = parseChannelUrl(uri);
  return channel ? channel.channelClaimId : null;
}

function readItems(text: string): Array<{
  raw: string;
  notificationsDisabled: boolean;
}> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(__("This file is empty."));
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    let json;
    try {
      json = JSON.parse(trimmed);
    } catch (e: any) {
      throw new Error(__("This file isn't valid JSON."));
    }

    const list = Array.isArray(json) ? json : json && (json.following || json.subscriptions);
    if (!Array.isArray(list)) {
      throw new Error(__("No list of channels found in this file."));
    }

    return list.map((item) => {
      if (typeof item === "string") {
        return { raw: item, notificationsDisabled: true };
      }
      const uri = item && typeof item.uri === "string" ? item.uri : JSON.stringify(item);
      return { raw: uri, notificationsDisabled: !(item && item.notificationsDisabled === false) };
    });
  }

  return trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => ({ raw: line, notificationsDisabled: true }));
}

// Returns the channel a URL points at, or null if it isn't a channel URL.
export function parseChannelUrl(raw: string):
  | {
      channelName: string;
      channelClaimId?: string;
    }
  | null
  | undefined {
  let uri = raw.trim();

  if (/^https?:\/\//i.test(uri)) {
    // Web links: the channel is the first part of the path, e.g. https://odysee.com/@name:id/video:x
    try {
      uri = decodeURIComponent(new URL(uri).pathname.split("/")[1] || "");
    } catch (e: any) {
      return null;
    }
  }

  if (!uri.startsWith("lbry://")) {
    uri = `lbry://${uri}`;
  }

  let parsed;
  try {
    parsed = parseURI(uri);
  } catch (e: any) {
    return null;
  }

  if (!parsed.channelName) {
    return null;
  }

  return parsed.channelClaimId
    ? { channelName: parsed.channelName, channelClaimId: parsed.channelClaimId }
    : { channelName: parsed.channelName };
}
