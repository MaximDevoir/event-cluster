/* eslint-disable */
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var jsdocFile = path.resolve(__dirname, '..', 'node_modules', '.bin', 'jsdoc');
console.log(jsdocFile);

fs.access(jsdocFile, fs.F_OK, function(err) {
  if (err) {
    console.log("Can\'t generate documentation. Dev dependencies not installed.");
  } else {
    exec("npm run build:docs", {
      cwd: path.resolve(__dirname, '..')
    }, function (error) {
      if (error) {
        console.log("Could\'t generate documentation.");
        console.log('Postinstall error', error);
      }
    });
  }
});
