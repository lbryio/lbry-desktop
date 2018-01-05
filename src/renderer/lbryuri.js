const CHANNEL_NAME_MIN_LEN = 1;
const CLAIM_ID_MAX_LEN = 40;

const Lbryuri = {};

Lbryuri.REGEXP_INVALID_URI = /[^A-Za-z0-9-]/g;
Lbryuri.REGEXP_ADDRESS = /^b(?=[^0OIl]{32,33})[0-9A-Za-z]{32,33}$/;

/**
 * Parses a LBRY name into its component parts. Throws errors with user-friendly
 * messages for invalid names.
 *
 * N.B. that "name" indicates the value in the name position of the URI. For
 * claims for channel content, this will actually be the channel name, and
 * the content name is in the path (e.g. lbry://@channel/content)
 *
 * In most situations, you'll want to use the contentName and channelName keys
 * and ignore the name key.
 *
 * Returns a dictionary with keys:
 *   - name (string): The value in the "name" position in the URI. Note that this
 *                    could be either content name or channel name; see above.
 *   - path (string, if persent)
 *   - claimSequence (int, if present)
 *   - bidPosition (int, if present)
 *   - claimId (string, if present)
 *   - isChannel (boolean)
 *   - contentName (string): For anon claims, the name; for channel claims, the path
 *   - channelName (string, if present): Channel name without @
 */
Lbryuri.parse = (uri, requireProto = false) => {
  // Break into components. Empty sub-matches are converted to null
  const componentsRegex = new RegExp(
    '^((?:lbry://)?)' + // protocol
    '([^:$#/]*)' + // name (stops at the first separator or end)
    '([:$#]?)([^/]*)' + // modifier separator, modifier (stops at the first path separator or end)
      '(/?)(.*)' // path separator, path
  );
  const [proto, name, modSep, modVal, pathSep, path] = componentsRegex
    .exec(uri)
    .slice(1)
    .map(match => match || null);

  let contentName;

  // Validate protocol
  if (requireProto && !proto) {
    throw new Error(__('LBRY URIs must include a protocol prefix (lbry://).'));
  }

  // Validate and process name
  if (!name) {
    throw new Error(__('URI does not include name.'));
  }

  const isChannel = name.startsWith('@');
  const channelName = isChannel ? name.slice(1) : name;

  if (isChannel) {
    if (!channelName) {
      throw new Error(__('No channel name after @.'));
    }

    if (channelName.length < CHANNEL_NAME_MIN_LEN) {
      throw new Error(__(`Channel names must be at least %s characters.`, CHANNEL_NAME_MIN_LEN));
    }

    contentName = path;
  }

  const nameBadChars = (channelName || name).match(Lbryuri.REGEXP_INVALID_URI);
  if (nameBadChars) {
    throw new Error(
      __(
        `Invalid character %s in name: %s.`,
        nameBadChars.length === 1 ? '' : 's',
        nameBadChars.join(', ')
      )
    );
  }

  // Validate and process modifier (claim ID, bid position or claim sequence)
  let claimId;
  let claimSequence;
  let bidPosition;
  if (modSep) {
    if (!modVal) {
      throw new Error(__(`No modifier provided after separator %s.`, modSep));
    }

    if (modSep === '#') {
      claimId = modVal;
    } else if (modSep === ':') {
      claimSequence = modVal;
    } else if (modSep === '$') {
      bidPosition = modVal;
    }
  }

  if (
    claimId &&
    (claimId.length > CLAIM_ID_MAX_LEN || !claimId.match(/^[0-9a-f]+$/)) &&
    !claimId.match(/^pending/) // ought to be dropped when savePendingPublish drops hack
  ) {
    throw new Error(__(`Invalid claim ID %s.`, claimId));
  }

  if (claimSequence && !claimSequence.match(/^-?[1-9][0-9]*$/)) {
    throw new Error(__('Claim sequence must be a number.'));
  }

  if (bidPosition && !bidPosition.match(/^-?[1-9][0-9]*$/)) {
    throw new Error(__('Bid position must be a number.'));
  }

  // Validate and process path
  if (path) {
    if (!isChannel) {
      throw new Error(__('Only channel URIs may have a path.'));
    }

    const pathBadChars = path.match(Lbryuri.REGEXP_INVALID_URI);
    if (pathBadChars) {
      throw new Error(__(`Invalid character in path: %s`, pathBadChars.join(', ')));
    }

    contentName = path;
  } else if (pathSep) {
    throw new Error(__('No path provided after /'));
  }

  return {
    name,
    path,
    isChannel,
    ...(contentName ? { contentName } : {}),
    ...(channelName ? { channelName } : {}),
    ...(claimSequence ? { claimSequence: parseInt(claimSequence, 10) } : {}),
    ...(bidPosition ? { bidPosition: parseInt(bidPosition, 10) } : {}),
    ...(claimId ? { claimId } : {}),
    ...(path ? { path } : {}),
  };
};

/**
 * Takes an object in the same format returned by lbryuri.parse() and builds a URI.
 *
 * The channelName key will accept names with or without the @ prefix.
 */
Lbryuri.build = (uriObj, includeProto = true) => {
  const { claimId, claimSequence, bidPosition, contentName, channelName } = uriObj;

  let { name, path } = uriObj;

  if (channelName) {
    const channelNameFormatted = channelName.startsWith('@') ? channelName : `@${channelName}`;
    if (!name) {
      name = channelNameFormatted;
    } else if (name !== channelNameFormatted) {
      throw new Error(
        __(
          'Received a channel content URI, but name and channelName do not match. "name" represents the value in the name position of the URI (lbry://name...), which for channel content will be the channel name. In most cases, to construct a channel URI you should just pass channelName and contentName.'
        )
      );
    }
  }

  if (contentName) {
    if (!name) {
      name = contentName;
    } else if (!path) {
      path = contentName;
    }
    if (path && path !== contentName) {
      throw new Error(
        __(
          'Path and contentName do not match. Only one is required; most likely you wanted contentName.'
        )
      );
    }
  }

  return (
    (includeProto ? 'lbry://' : '') +
    name +
    (claimId ? `#${claimId}` : '') +
    (claimSequence ? `:${claimSequence}` : '') +
    (bidPosition ? `${bidPosition}` : '') +
    (path ? `/${path}` : '')
  );
};

/* Takes a parseable LBRY URI and converts it to standard, canonical format (currently this just
 * consists of adding the lbry:// prefix if needed) */
Lbryuri.normalize = uri => {
  if (uri.match(/pending_claim/)) return uri;

  const { name, path, bidPosition, claimSequence, claimId } = Lbryuri.parse(uri);
  return Lbryuri.build({ name, path, claimSequence, bidPosition, claimId });
};

Lbryuri.isValid = uri => {
  let parts;
  try {
    parts = Lbryuri.parse(Lbryuri.normalize(uri));
  } catch (error) {
    return false;
  }
  return parts && parts.name;
};

Lbryuri.isValidName = (name, checkCase = true) => {
  const regexp = new RegExp('^[a-z0-9-]+$', checkCase ? '' : 'i');
  return regexp.test(name);
};

Lbryuri.isClaimable = uri => {
  let parts;
  try {
    parts = Lbryuri.parse(Lbryuri.normalize(uri));
  } catch (error) {
    return false;
  }
  return (
    parts &&
    parts.name &&
    !parts.claimId &&
    !parts.bidPosition &&
    !parts.claimSequence &&
    !parts.isChannel &&
    !parts.path
  );
};

window.lbryuri = Lbryuri;
export default Lbryuri;
