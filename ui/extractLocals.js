var extract = require('i18n-extract');
const fs = require('fs');

var path = '../app/dist/locales/en.json';

fs.writeFile(path, '{}', 'utf8', function(err) {
    if(err) {
        return console.log(err);
    }
    var enLocale = require(path);

    const keys = extract.extractFromFiles(['js/**/*.{js,jsx}'], {
    marker: '__',
    });

    let reports = [];
    reports = reports.concat(extract.findMissing(enLocale, keys));
    reports = reports.concat(extract.findUnused(enLocale, keys));
    reports = reports.concat(extract.findDuplicated(enLocale, keys));

    if (reports.length > 0) {
        fs.readFile(path, 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                localeObj = JSON.parse(data);

                for (var i = 0; i < reports.length; i++) {
                    if (reports[i].type === 'MISSING') {
                        localeObj[reports[i].key] = reports[i].key;
                    } else if (reports[i].type === 'UNUSED') {
                        console.log("Found unused String in en.json, but beware: This may be a String from api.lbry.io, do not blindly delete!")
                        console.log(reports[i]);
                    } else if (reports[i].type == "DUPLICATED") {
                        console.log("Found duplicated String in en.json!")
                        console.log(reports[i]);
                    } else {
                        console.log("Found unknown type of String in en.json!")
                        console.log(reports[i]);
                    }
                }

                var json = JSON.stringify(localeObj, null, '\t'); //convert it back to json
                fs.writeFile(path, json, 'utf8', function callback(err) {
                    if (err) throw err;
                    console.log('It\'s saved!');
                });
            }
        });
    }
}); 







