const { parseURI } = require('lbry-redux');
const { WEB_SERVER_PORT } = require('../../config');
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

const getClaim = (claimName, claimId, callback) => {
  let params = [claimName];

  let sql =
    'SELECT channel_claim.name as channel, claim.claim_id, claim.name, claim.description, claim.language, claim.thumbnail_url, claim.title ' +
    'FROM claim ' +
    'LEFT JOIN claim channel_claim on claim.publisher_id = channel_claim.claim_id ' +
    'WHERE claim.name = ?';

  if (claimId) {
    sql += ' AND claim.claim_id LIKE ?';
    params.push(claimId + '%');
  } else {
    sql += ' AND claim.bid_state = "controlling"';
  }

  sql += ' LIMIT 1';

  pool.query(sql, params, callback);
};

app.use(express.static(__dirname));

function truncateDescription(description) {
  return description.length > 200 ? description.substr(0, 200) + '...' : description;
}

function insertToHead(fullHtml, htmlToInsert) {
  return fullHtml.replace('%%HEAD_TOKEN%%', htmlToInsert);
}

const defaultHead =
  '<title>lbry.tv</title>\n' +
  '<meta property="og:url" content="https://beta.lbry.tv" />\n' +
  '<meta property="og:title" content="LBRY On The Web" />\n' +
  '<meta property="og:site_name" content="LBRY.tv"/>\n' +
  '<meta property="og:description" content="All your favorite LBRY content in your browser." />\n' +
  '<meta property="og:image" content="/og.png" />';

app.get('*', async (req, res) => {
  let html = readFileSync(path.join(__dirname, '/index.html'), 'utf8');
  const urlPath = req.path.substr(1); // trim leading slash

  if (urlPath.match(/^([^@/:]+)\/([^:/]+)$/)) {
    return res.redirect(301, req.url.replace(/([^/:]+)\/([^:/]+)/, '$1:$2')); // test against urlPath, but use req.url to retain parameters
  }

  if (urlPath.length > 0 && urlPath[0] !== '$') {
    const { isChannel, streamName, channelName, channelClaimId, streamClaimId } = parseURI(urlPath.replace(/:/g, '#'));
    const claimName = isChannel ? '@' + channelName : streamName;
    const claimId = isChannel ? channelClaimId : streamClaimId;

    getClaim(claimName, claimId, (err, rows) => {
      if (!err && rows && rows.length > 0) {
        const claim = rows[0];
        const title = claim.title ? claim.title : claimName;
        const claimDescription =
          claim.description && claim.description.length > 0
            ? truncateDescription(claim.description)
            : `Watch ${title} on LBRY.tv`;
        const claimLanguage = claim.language || 'en_US';
        const claimThumbnail = claim.thumbnail_url || '/og.png';
        const claimTitle =
          claim.channel && !isChannel ? `${title} from ${claim.channel} on LBRY.tv` : `${title} on LBRY.tv`;

        let head = '';

        head += '<meta charset="utf8"/>';
        head += `<meta name="description" content="${claimDescription}"/>`;
        if (claim.tags) {
          head += `<meta name="keywords" content="${claim.tags.toString()}"/>`;
        }
        head += `<meta name="twitter:image" content="${claimThumbnail}"/>`;
        head += `<meta property="og:description" content="${claimDescription}"/>`;
        head += `<meta property="og:image" content="${claimThumbnail}"/>`;
        head += `<meta property="og:locale" content="${claimLanguage}"/>`;
        head += `<meta property="og:site_name" content="LBRY.tv"/>`;
        head += `<meta property="og:type" content="website"/>`;
        // below should be canonical_url, but not provided by chainquery yet
        head += `<meta property="og:url" content="https://beta.lbry.tv/${claim.name}:${claim.claim_id}"/>`;
        head += `<title>${claimTitle}</title>`;

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
