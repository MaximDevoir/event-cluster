/* eslint-disable */

var exec = require('child_process').exec;
var path = require('path');

fs.access(path.join(__dirname, '..', 'node_modules', '.bin', 'jsdoc'), fs.F_OK, function(err) {
  if (!err) {
    console.log("Can\'t generate documentation. Dev dependencies not installed.")
  } else {
    exec("npm run build:docs", {
      cwd: path.resolve(__dirname, '..')
    }, function (error){
      console.log("Could\'t generate documentation.");
      throw error;
    });
  }
});
