const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'chainquery.lbry.com',
  user: 'odyseefrontend',
  password: process.env.CHAINQUERY_MYSQL_PASSWORD,
  database: 'chainquery',
});

function queryPool(sql, params) {
  return new Promise((resolve) => {
    pool.query(sql, params, (error, rows) => {
      if (error) {
        console.log('error', error); // eslint-disable-line
        resolve();
        return;
      }

      resolve(rows);
    });
  });
}

module.exports.getClaim = async function getClaim(claimName, claimId, channelName, channelClaimId) {
  let params = [claimName];

  let sql =
    'SELECT channel_claim.name as channel, claim.claim_id, claim.name, claim.description, claim.language, claim.thumbnail_url, claim.title, claim.source_media_type, claim.frame_width, claim.frame_height, claim.fee, claim.release_time, claim.duration, claim.audio_duration, ' +
    'repost_channel.name as repost_channel, reposted_claim.claim_id as reposted_claim_id, reposted_claim.name as reposted_name, reposted_claim.description as reposted_description, reposted_claim.language as reposted_language, reposted_claim.thumbnail_url as reposted_thumbnail_url, reposted_claim.title as reposted_title, reposted_claim.source_media_type as reposted_source_media_type, reposted_claim.frame_width as reposted_frame_width, reposted_claim.frame_height as reposted_frame_height, reposted_claim.fee as reposted_fee ' +
    'FROM claim ' +
    'LEFT JOIN claim channel_claim on claim.publisher_id = channel_claim.claim_id ' +
    'LEFT JOIN claim as reposted_claim on reposted_claim.claim_id = claim.claim_reference ' +
    'AND (reposted_claim.bid_state in ("controlling", "active", "accepted", "spent")) ' +
    'LEFT JOIN claim as repost_channel on repost_channel.claim_id = reposted_claim.publisher_id ' +
    'WHERE claim.name = ?';

  if (claimId) {
    sql += ' AND claim.claim_id LIKE ?';
    params.push(claimId + '%');
    sql += ' AND claim.bid_state in ("controlling", "active", "accepted", "spent")';
  } else {
    sql += ' AND claim.bid_state in ("controlling", "active", "accepted")';
  }

  if (claimName[0] !== '@' && channelName) {
    sql += ' AND channel_claim.name = ?';
    params.push('@' + channelName);
    if (channelClaimId) {
      sql += ' AND channel_claim.claim_id LIKE ?';
      params.push(channelClaimId + '%');
    } else {
      sql += ' AND channel_claim.bid_state in ("controlling", "active", "accepted", "spent")';
    }
  }

  sql += ' ORDER BY claim.bid_state DESC LIMIT 1';

  return queryPool(sql, params);
};
