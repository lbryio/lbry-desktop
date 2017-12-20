const extract = require("i18n-extract");
const fs = require("fs");
const path = require("path");

const outputDir = `${__dirname}/../static/locales`;
const outputPath = `${outputDir}/en.json`;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFile(outputPath, "{}", "utf8", err => {
  if (err) {
    return console.log(err);
  }
  const enLocale = require(outputPath);

  const keys = extract.extractFromFiles("src/**/*.{js,jsx}", {
    marker: "__",
  });

  let reports = [];
  reports = reports.concat(extract.findMissing(enLocale, keys));

  if (reports.length > 0) {
    fs.readFile(outputPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        localeObj = JSON.parse(data);

        for (let i = 0; i < reports.length; i++) {
          // no need to care for other types than MISSING because starting file will always be empty
          if (reports[i].type === "MISSING") {
            localeObj[reports[i].key] = reports[i].key;
          }
        }

        const json = JSON.stringify(localeObj, null, "\t"); // convert it back to json-string
        fs.writeFile(outputPath, json, "utf8", err => {
          if (err) {
            throw err;
          }
          console.log("Extracted all strings!");
        });
      }
    });
  }
});
