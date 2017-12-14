const extract = require("i18n-extract");
const fs = require("fs");

const dir = `${__dirname}/../../static/locales`;
const path = `${dir}/en.json`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.writeFile(path, "{}", "utf8", err => {
  if (err) {
    return console.log(err);
  }
  const enLocale = require(path);

  const keys = extract.extractFromFiles(["js/**/*.{js,jsx}"], {
    marker: "__",
  });

  let reports = [];
  reports = reports.concat(extract.findMissing(enLocale, keys));

  if (reports.length > 0) {
    fs.readFile(path, "utf8", (err, data) => {
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
        fs.writeFile(path, json, "utf8", err => {
          if (err) {
            throw err;
          }
          console.log("Extracted all strings!");
        });
      }
    });
  }
});
