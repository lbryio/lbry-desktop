// Todo: Add  a better way to do this
const { readdirSync } = require("fs");
const { extname } = require("path");
const { remote } = require("electron");

function getThemes() {
  // Themes path
  const themesPath = `${remote.app.getAppPath()}/dist/themes`;

  // Get all themes / only .css
  const themes = readdirSync(themesPath).filter(function(file) {
    return extname(file) === ".css";
  });

  // Remove file extension (css)
  return themes.map(function(theme) {
    return theme.replace(".css", "");
  });
}

export default getThemes;
