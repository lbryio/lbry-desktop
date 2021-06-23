const { URL, SITE_TITLE } = require('../../config.js');

function getOpenSearchXml() {
  return (
    `<ShortName>${SITE_TITLE}</ShortName>` +
    `<Description>Search ${SITE_TITLE}</Description>` +
    '<InputEncoding>UTF-8</InputEncoding>' +
    `<Image width="32" height="32" type="image/png">${URL}/public/favicon.png</Image>` +
    `<Url type="text/html" method="get" template="${URL}/$/search?q={searchTerms}"/>` +
    `<moz:SearchForm>${URL}</moz:SearchForm>`
  );
}

function insertVariableXml(fullXml, xmlToInsert) {
  return fullXml.replace(/<!-- VARIABLE_XML_BEGIN -->.*<!-- VARIABLE_XML_END -->/s, xmlToInsert);
}

module.exports = { getOpenSearchXml, insertVariableXml };
