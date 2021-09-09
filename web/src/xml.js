const { URL, SITE_TITLE, FAVICON } = require('../../config.js');
const favicon = FAVICON || `${URL}/public/favicon.png`;
function getOpenSearchXml() {
  return (
    `<ShortName>${SITE_TITLE}</ShortName>` +
    `<Description>Search ${SITE_TITLE}</Description>` +
    '<InputEncoding>UTF-8</InputEncoding>' +
    `<Image width="32" height="32" type="image/png">${favicon}</Image>` +
    `<Url type="text/html" method="get" template="${URL}/$/search?q={searchTerms}"/>` +
    `<moz:SearchForm>${URL}</moz:SearchForm>`
  );
}

function insertVariableXml(fullXml, xmlToInsert) {
  return fullXml.replace(/<!-- VARIABLE_XML_BEGIN -->.*<!-- VARIABLE_XML_END -->/s, xmlToInsert);
}

module.exports = { getOpenSearchXml, insertVariableXml };
