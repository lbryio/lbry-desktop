// Disabled flow in this copy. This copy is for uncompiled web server ES5 require()s.

// Placeholder until i18n can be adapted for node usage
const __ = (msg) => msg;

const isProduction = process.env.NODE_ENV === 'production';
const channelNameMinLength = 1;
const claimIdMaxLength = 40;

// see https://spec.lbry.com/#urls
const regexInvalidURI = /[ =&#:$@%?;/\\"<>%{}|^~[\]`\u{0000}-\u{0008}\u{000b}-\u{000c}\u{000e}-\u{001F}\u{D800}-\u{DFFF}\u{FFFE}-\u{FFFF}]/u;
// const regexAddress = /^(b|r)(?=[^0OIl]{32,33})[0-9A-Za-z]{32,33}$/;
const regexPartProtocol = '^((?:lbry://)?)';
const regexPartStreamOrChannelName = '([^:$#/]*)';
const regexPartModifierSeparator = '([:$#]?)([^/]*)';
const queryStringBreaker = '^([\\S]+)([?][\\S]*)';
const separateQuerystring = new RegExp(queryStringBreaker);

const MOD_SEQUENCE_SEPARATOR = '*';
const MOD_CLAIM_ID_SEPARATOR_OLD = '#';
const MOD_CLAIM_ID_SEPARATOR = ':';
const MOD_BID_POSITION_SEPARATOR = '$';

/**
 * Parses a LBRY name into its component parts. Throws errors with user-friendly
 * messages for invalid names.
 *
 * Returns a dictionary with keys:
 *   - path (string)
 *   - isChannel (boolean)
 *   - streamName (string, if present)
 *   - streamClaimId (string, if present)
 *   - channelName (string, if present)
 *   - channelClaimId (string, if present)
 *   - primaryClaimSequence (int, if present)
 *   - secondaryClaimSequence (int, if present)
 *   - primaryBidPosition (int, if present)
 *   - secondaryBidPosition (int, if present)
 */

function parseURI(url, requireProto = false) {
  // Break into components. Empty sub-matches are converted to null

  const componentsRegex = new RegExp(
    regexPartProtocol + // protocol
      regexPartStreamOrChannelName + // stream or channel name (stops at the first separator or end)
      regexPartModifierSeparator + // modifier separator, modifier (stops at the first path separator or end)
      '(/?)' + // path separator, there should only be one (optional) slash to separate the stream and channel parts
      regexPartStreamOrChannelName +
      regexPartModifierSeparator
  );
  // chop off the querystring first
  let QSStrippedURL, qs;
  const qsRegexResult = separateQuerystring.exec(url);
  if (qsRegexResult) {
    [QSStrippedURL, qs] = qsRegexResult.slice(1).map((match) => match || null);
  }

  const cleanURL = QSStrippedURL || url;
  const regexMatch = componentsRegex.exec(cleanURL) || [];
  const [proto, ...rest] = regexMatch.slice(1).map((match) => match || null);
  const path = rest.join('');
  const [
    streamNameOrChannelName,
    primaryModSeparator,
    rawPrimaryModValue,
    pathSep, // eslint-disable-line no-unused-vars
    possibleStreamName,
    secondaryModSeparator,
    secondaryModValue,
  ] = rest;
  const primaryModValue = rawPrimaryModValue && rawPrimaryModValue.replace(/[^\x00-\x7F]/g, '');
  const searchParams = new URLSearchParams(qs || '');
  const startTime = searchParams.get('t');

  // Validate protocol
  if (requireProto && !proto) {
    throw new Error(__('LBRY URLs must include a protocol prefix (lbry://).'));
  }

  // Validate and process name
  if (!streamNameOrChannelName) {
    throw new Error(__('URL does not include name.'));
  }

  rest.forEach((urlPiece) => {
    if (urlPiece && urlPiece.includes(' ')) {
      throw new Error(__('URL can not include a space'));
    }
  });

  const includesChannel = streamNameOrChannelName.startsWith('@');
  const isChannel = streamNameOrChannelName.startsWith('@') && !possibleStreamName;
  const channelName = includesChannel && streamNameOrChannelName.slice(1);

  if (includesChannel) {
    if (!channelName) {
      throw new Error(__('No channel name after @.'));
    }

    if (channelName.length < channelNameMinLength) {
      throw new Error(
        __(`Channel names must be at least ${channelNameMinLength} characters.`, {
          channelNameMinLength,
        })
      );
    }
  }

  // Validate and process modifier
  const [primaryClaimId, primaryClaimSequence, primaryBidPosition] = parseURIModifier(
    primaryModSeparator,
    primaryModValue
  );
  const [secondaryClaimId, secondaryClaimSequence, secondaryBidPosition] = parseURIModifier(
    secondaryModSeparator,
    secondaryModValue
  );
  const streamName = includesChannel ? possibleStreamName : streamNameOrChannelName;
  const streamClaimId = includesChannel ? secondaryClaimId : primaryClaimId;
  const channelClaimId = includesChannel && primaryClaimId;

  return {
    isChannel,
    path,
    ...(streamName ? { streamName } : {}),
    ...(streamClaimId ? { streamClaimId } : {}),
    ...(channelName ? { channelName } : {}),
    ...(channelClaimId ? { channelClaimId } : {}),
    ...(primaryClaimSequence ? { primaryClaimSequence: parseInt(primaryClaimSequence, 10) } : {}),
    ...(secondaryClaimSequence ? { secondaryClaimSequence: parseInt(secondaryClaimSequence, 10) } : {}),
    ...(primaryBidPosition ? { primaryBidPosition: parseInt(primaryBidPosition, 10) } : {}),
    ...(secondaryBidPosition ? { secondaryBidPosition: parseInt(secondaryBidPosition, 10) } : {}),
    ...(startTime ? { startTime: parseInt(startTime, 10) } : {}),

    // The values below should not be used for new uses of parseURI
    // They will not work properly with canonical_urls
    claimName: streamNameOrChannelName,
    claimId: primaryClaimId,
    ...(streamName ? { contentName: streamName } : {}),
    ...(qs ? { queryString: qs } : {}),
  };
}

function parseURIModifier(modSeperator, modValue) {
  let claimId;
  let claimSequence;
  let bidPosition;

  if (modSeperator) {
    if (!modValue) {
      throw new Error(__(`No modifier provided after separator ${modSeperator}.`, { modSeperator }));
    }

    if (modSeperator === MOD_CLAIM_ID_SEPARATOR || MOD_CLAIM_ID_SEPARATOR_OLD) {
      claimId = modValue;
    } else if (modSeperator === MOD_SEQUENCE_SEPARATOR) {
      claimSequence = modValue;
    } else if (modSeperator === MOD_BID_POSITION_SEPARATOR) {
      bidPosition = modValue;
    }
  }

  if (claimId && (claimId.length > claimIdMaxLength || !claimId.match(/^[0-9a-f]+$/))) {
    throw new Error(__(`Invalid claim ID ${claimId}.`, { claimId }));
  }

  if (claimSequence && !claimSequence.match(/^-?[1-9][0-9]*$/)) {
    throw new Error(__('Claim sequence must be a number.'));
  }

  if (bidPosition && !bidPosition.match(/^-?[1-9][0-9]*$/)) {
    throw new Error(__('Bid position must be a number.'));
  }

  return [claimId, claimSequence, bidPosition];
}

/**
 * Takes an object in the same format returned by parse() and builds a URI.
 *
 * The channelName key will accept names with or without the @ prefix.
 */
function buildURI(UrlObj, includeProto = true, protoDefault = 'lbry://') {
  const {
    streamName,
    streamClaimId,
    channelName,
    channelClaimId,
    primaryClaimSequence,
    primaryBidPosition,
    secondaryClaimSequence,
    secondaryBidPosition,
    startTime,
    ...deprecatedParts
  } = UrlObj;
  const { claimId, claimName, contentName } = deprecatedParts;

  if (!isProduction) {
    if (claimId) {
      console.error(__("'claimId' should no longer be used. Use 'streamClaimId' or 'channelClaimId' instead"));
    }
    if (claimName) {
      console.error(__("'claimName' should no longer be used. Use 'streamClaimName' or 'channelClaimName' instead"));
    }
    if (contentName) {
      console.error(__("'contentName' should no longer be used. Use 'streamName' instead"));
    }
  }

  if (!claimName && !channelName && !streamName) {
    console.error(
      __("'claimName', 'channelName', and 'streamName' are all empty. One must be present to build a url.")
    );
  }

  const formattedChannelName = channelName && (channelName.startsWith('@') ? channelName : `@${channelName}`);
  const primaryClaimName = claimName || contentName || formattedChannelName || streamName;
  const primaryClaimId = claimId || (formattedChannelName ? channelClaimId : streamClaimId);
  const secondaryClaimName = (!claimName && contentName) || (formattedChannelName ? streamName : null);
  const secondaryClaimId = secondaryClaimName && streamClaimId;

  return (
    (includeProto ? protoDefault : '') +
    // primaryClaimName will always exist here because we throw above if there is no "name" value passed in
    // $FlowFixMe
    primaryClaimName +
    (primaryClaimId ? `#${primaryClaimId}` : '') +
    (primaryClaimSequence ? `:${primaryClaimSequence}` : '') +
    (primaryBidPosition ? `${primaryBidPosition}` : '') +
    (secondaryClaimName ? `/${secondaryClaimName}` : '') +
    (secondaryClaimId ? `#${secondaryClaimId}` : '') +
    (secondaryClaimSequence ? `:${secondaryClaimSequence}` : '') +
    (secondaryBidPosition ? `${secondaryBidPosition}` : '') +
    (startTime ? `?t=${startTime}` : '')
  );
}

/* Takes a parseable LBRY URL and converts it to standard, canonical format */
function normalizeURI(URL) {
  const {
    streamName,
    streamClaimId,
    channelName,
    channelClaimId,
    primaryClaimSequence,
    primaryBidPosition,
    secondaryClaimSequence,
    secondaryBidPosition,
    startTime,
  } = parseURI(URL);

  return buildURI({
    streamName,
    streamClaimId,
    channelName,
    channelClaimId,
    primaryClaimSequence,
    primaryBidPosition,
    secondaryClaimSequence,
    secondaryBidPosition,
    startTime,
  });
}

function isURIValid(URL) {
  try {
    parseURI(normalizeURI(URL));
  } catch (error) {
    return false;
  }

  return true;
}

function isNameValid(claimName) {
  return !regexInvalidURI.test(claimName);
}

function isURIClaimable(URL) {
  let parts;
  try {
    parts = parseURI(normalizeURI(URL));
  } catch (error) {
    return false;
  }

  return parts && parts.streamName && !parts.streamClaimId && !parts.isChannel;
}

function convertToShareLink(URL) {
  const {
    streamName,
    streamClaimId,
    channelName,
    channelClaimId,
    primaryBidPosition,
    primaryClaimSequence,
    secondaryBidPosition,
    secondaryClaimSequence,
  } = parseURI(URL);
  return buildURI(
    {
      streamName,
      streamClaimId,
      channelName,
      channelClaimId,
      primaryBidPosition,
      primaryClaimSequence,
      secondaryBidPosition,
      secondaryClaimSequence,
    },
    true,
    'https://open.lbry.com/'
  );
}

function splitBySeparator(uri) {
  const protocolLength = 7;
  return uri.startsWith('lbry://') ? uri.slice(protocolLength).split(/[#:*]/) : uri.split(/#:\*\$/);
}

function isURIEqual(uriA, uriB) {
  const parseA = parseURI(normalizeURI(uriA));
  const parseB = parseURI(normalizeURI(uriB));
  if (parseA.isChannel) {
    if (parseB.isChannel && parseA.channelClaimId === parseB.channelClaimId) {
      return true;
    }
  } else if (parseA.streamClaimId === parseB.streamClaimId) {
    return true;
  } else {
    return false;
  }
}

function normalizeClaimUrl(url) {
  return normalizeURI(url.replace(/:/g, '#'));
}

module.exports = {
  parseURI,
  buildURI,
  normalizeURI,
  normalizeClaimUrl,
  isURIValid,
  isURIEqual,
  isNameValid,
  isURIClaimable,
  splitBySeparator,
  convertToShareLink,
};
