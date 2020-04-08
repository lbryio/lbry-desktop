const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'chainquery.lbry.com',
  user: 'lbrytv',
  password: process.env.CHAINQUERY_MYSQL_PASSWORD,
  database: 'chainquery',
});

function queryPool(sql, params) {
  return new Promise(resolve => {
    pool.query(sql, params, (error, rows) => {
      if (error) {
        throw Error(error);
      }

      resolve(rows);
    });
  });
}

module.exports.getClaim = async function getClaim(claimName, claimId, channelName, channelClaimId) {
  let params = [claimName];

  let sql =
    'SELECT channel_claim.name as channel, claim.claim_id, claim.name, claim.description, claim.language, claim.thumbnail_url, claim.title, claim.source_media_type, claim.frame_width, claim.frame_height, claim.fee ' +
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

  return queryPool(sql, params);
};
