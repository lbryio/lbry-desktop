var fs = require('fs');
var path = require('path');
var extract = require('i18n-extract');
var enLocale = require('../app/dist/locales/en.json');

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          results.push(file + "/*.js");
          results.push(file + "/*.jsx");
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
         // results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('js/', function(err, results) {
  if (err) throw err;
  results.push('js/*.js')
  results.push('js/*.jsx')
  const keys = extract.extractFromFiles(results, {
    marker: '__',
    });

    let reports = [];
    reports = reports.concat(extract.findMissing(enLocale, keys));
    reports = reports.concat(extract.findUnused(enLocale, keys));
    reports = reports.concat(extract.findDuplicated(enLocale, keys));

    if (reports.length > 0) {
        fs.readFile('../app/dist/locales/en.json', 'utf8', function readFileCallback(err, data){
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
                fs.writeFile('../app/dist/locales/en.json', json, 'utf8', function callback(err) {
                    if (err) throw err;
                    console.log('It\'s saved!');
                });
            }
        });
    }
});




