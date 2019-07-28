const { readFileSync } = require('fs');
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = 1337;
const headRegex = /(<head>).*(<\/head>)/g;

app.use(express.static(__dirname));

app.get('*', async (req, res) => {
  let finalHtml = '';
  let identifier = req.url.split('/').pop();
  let isAppPage = req.url.includes('/$/');
  let isChannel = req.url.includes('/@');
  let queryUrl = '';

  switch (true) {
    case isAppPage:
      return res.sendFile(path.join(__dirname, '/index.html'));

    case isChannel:
      queryUrl = `https://chainquery.lbry.io/api/sql?query=SELECT channel.name as channel, claim.name, claim.description, claim.language, claim.thumbnail_url, claim.title FROM claim left join claim channel on claim.publisher_id = channel.claim_id where claim.claim_id="${identifier}"`;
      break;

    default:
      // isContentPage
      queryUrl = `https://chainquery.lbry.io/api/sql?query=SELECT * FROM claim where claim_id="${identifier}"`;
      break;
  }

  [finalHtml] = await Promise.all([
    fetch(queryUrl)
      .then(response => response.json())
      .then(claim => {
        if (!claim.success || !claim.data[0]) {
          return path.join(__dirname, '/index.html');
        }

        claim = claim.data[0];

        // const claimAuthor = claim.channel_name ? claim.channel_name : 'Anonymous'; // Currently unable to get creator name
        const claimDescription =
          claim.description && claim.description.length > 0 ? claim.description : `Watch ${claim.title} on LBRY.tv`;
        const claimLanguage = claim.language || 'en_US';
        const claimThumbnail = claim.thumbnail_url || '/og.png';
        const claimTitle = `${claim.title} on LBRY.tv` || 'LBRY.tv'; // `${claim.title} from ${claimAuthor} on LBRY.tv`;
        const claimUrl =
          `https://beta.lbry.tv/${claim.name}${claim.claim_id ? `/${claim.claim_id}` : ''}` || 'https://beta.lbry.tv';
        // This comment was inlined and preventing the rest of the script to load
        const indexHtml = readFileSync(path.join(__dirname, '/index.html'), 'utf8')
          .replace(/\s\s/gm, '')
          .replace(/>\s</gm, '><')
          .replace('// Use relative path if we are in electron', '');
        let finalTags = '';

        finalTags += '<meta charset="utf8"/>';
        finalTags += `<meta name="description" content="${claimDescription}"/>`;
        finalTags += `<meta name="keywords" content="${claim.tags ? claim.tags.toString() : ''}"/>`;
        finalTags += `<meta name="twitter:image" content="${claimThumbnail}"/>`;
        finalTags += `<meta property="og:description" content="${claimDescription}"/>`;
        finalTags += `<meta property="og:image" content="${claimThumbnail}"/>`;
        finalTags += `<meta property="og:locale" content="${claimLanguage}"/>`;
        finalTags += `<meta property="og:site_name" content="LBRY.tv"/>`;
        finalTags += `<meta property="og:type" content="website"/>`;
        finalTags += `<meta property="og:url" content="${claimUrl}"/>`;
        finalTags += `<title>${claimTitle}</title>`;

        return indexHtml.replace(indexHtml.match(headRegex)[0], finalTags);
      }),
  ]);

  res.send(finalHtml);
});

app.listen(port, () => console.log(`UI server listening at http://localhost:${port}`));
