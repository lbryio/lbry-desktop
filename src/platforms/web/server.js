const { parseURI } = require('lbry-redux');
const { generateStreamUrl } = require('../../src/ui/util/lbrytv');
const { WEB_SERVER_PORT, DOMAIN } = require('../../config');
const { readFileSync } = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'chainquery.lbry.com',
  user: 'lbrytv',
  password: process.env.CHAINQUERY_MYSQL_PASSWORD,
  database: 'chainquery',
});

const getClaim = (claimName, claimId, channelName, channelClaimId, callback) => {
  let params = [claimName];

  let sql =
    'SELECT channel_claim.name as channel, claim.claim_id, claim.name, claim.description, claim.language, claim.thumbnail_url, claim.title, claim.source_media_type, claim.frame_width, claim.frame_height ' +
    'FROM claim ' +
    'LEFT JOIN claim channel_claim on claim.publisher_id = channel_claim.claim_id ' +
    'WHERE claim.name = ?';

  if (claimId) {
    sql += ' AND claim.claim_id LIKE ?';
    params.push(claimId + '%');
  } else {
    sql += ' AND claim.bid_state = "controlling"';
  }

  if (claimName[0] !== '@' && channelName) {
    sql += ' AND channel_claim.name = ?';
    params.push('@' + channelName);
    if (channelClaimId) {
      sql += ' AND channel_claim.claim_id LIKE ?';
      params.push(channelClaimId + '%');
    } else {
      sql += ' AND channel_claim.bid_state = "controlling"';
    }
  }

  sql += ' LIMIT 1';

  pool.query(sql, params, callback);
};

app.use(express.static(__dirname));

function truncateDescription(description) {
  return description.length > 200 ? description.substr(0, 200) + '...' : description;
}

function insertToHead(fullHtml, htmlToInsert) {
  return fullHtml.replace(/<!-- VARIABLE_HEAD_BEGIN -->.*<!-- VARIABLE_HEAD_END -->/s, htmlToInsert);
}

const defaultHead =
  '<title>lbry.tv</title>\n' +
  `<meta property="og:url" content="${DOMAIN}" />\n` +
  '<meta property="og:title" content="lbry.tv" />\n' +
  '<meta property="og:site_name" content="lbry.tv"/>\n' +
  '<meta property="og:description" content="All your favorite LBRY content in your browser." />\n' +
  `<meta property="og:image" content="${DOMAIN}/og.png" />\n` +
  '<meta property="fb:app_id" content="1673146449633983" />';

app.get('*', async (req, res) => {
  let html = readFileSync(path.join(__dirname, '/index.html'), 'utf8');
  const urlPath = req.path.substr(1); // trim leading slash

  if (!urlPath.startsWith('$/') && urlPath.match(/^([^@/:]+)\/([^:/]+)$/)) {
    return res.redirect(301, req.url.replace(/^([^@/:]+)\/([^:/]+)(:(\/.*))/, '$1:$2')); // test against urlPath, but use req.url to retain parameters
  }

  if (urlPath.endsWith('/') && urlPath.length > 1) {
    return res.redirect(301, req.url.replace(/\/$/, ''));
  }

  if (urlPath.length > 0 && urlPath[0] !== '$') {
    const { isChannel, streamName, channelName, channelClaimId, streamClaimId } = parseURI(urlPath.replace(/:/g, '#'));
    const claimName = isChannel ? '@' + channelName : streamName;
    const claimId = isChannel ? channelClaimId : streamClaimId;

    getClaim(claimName, claimId, channelName, channelClaimId, (err, rows) => {
      if (!err && rows && rows.length > 0) {
        const claim = rows[0];
        const title = claim.title ? claim.title : claimName;
        const claimDescription =
          claim.description && claim.description.length > 0
            ? truncateDescription(claim.description)
            : `Watch ${title} on LBRY.tv`;
        const claimLanguage = claim.language || 'en_US';
        const claimThumbnail = claim.thumbnail_url || `${DOMAIN}/og.png`;
        const claimTitle =
          claim.channel && !isChannel ? `${title} from ${claim.channel} on LBRY.tv` : `${title} on LBRY.tv`;

        let head = '';

        head += '<meta charset="utf8"/>';
        head += `<title>${claimTitle}</title>`;
        head += `<meta name="description" content="${claimDescription}"/>`;
        if (claim.tags) {
          head += `<meta name="keywords" content="${claim.tags.toString()}"/>`;
        }
        head += `<meta name="twitter:card" content="summary_large_image"/>`;
        head += `<meta name="twitter:image" content="${claimThumbnail}"/>`;
        head += `<meta property="og:description" content="${claimDescription}"/>`;
        head += `<meta property="og:image" content="${claimThumbnail}"/>`;
        head += `<meta property="og:locale" content="${claimLanguage}"/>`;
        head += `<meta property="og:site_name" content="LBRY.tv"/>`;
        head += `<meta property="og:type" content="website"/>`;
        // below should be canonical_url, but not provided by chainquery yet
        head += `<meta property="og:url" content="${DOMAIN}/${claim.name}:${claim.claim_id}"/>`;

        if (claim.source_media_type && claim.source_media_type.startsWith('video/')) {
          const videoUrl = generateStreamUrl(claim.name, claim.claim_id);
          head += `<meta property="og:video" content="${videoUrl}" />`;
          head += `<meta property="og:video:secure_url" content="${videoUrl}" />`;
          head += `<meta property="og:video:type" content="${claim.source_media_type}" />`;
          if (claim.frame_width && claim.frame_height) {
            head += `<meta property="og:video:width" content="${claim.frame_width}"/>`;
            head += `<meta property="og:video:height" content="${claim.frame_height}"/>`;
          }
        }

        html = insertToHead(html, head);
      } else {
        html = insertToHead(html, defaultHead);
      }

      res.send(html);
    });
  } else {
    res.send(insertToHead(html, defaultHead));
  }
});

app.listen(WEB_SERVER_PORT, () => console.log(`UI server listening at http://localhost:${WEB_SERVER_PORT}`)); // eslint-disable-line
