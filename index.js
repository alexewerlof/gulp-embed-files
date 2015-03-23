/*global module*/
'use strict';

var through2 = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var util = require('util');
var PLUGIN_NAME = 'gulp-embed-files';

module.exports = function (dest, options) {

  if (!dest) {
    PluginError(PLUGIN_NAME, 'Invalid dest parameter');
  }

  options = options || {};
  options['encDefault'] = options['encDefault'] || 'utf8';
  var firstFile = false;
  var base, cwd;
  //The file path separator
  options.replaceSep = options.replaceSep || '/';
  var result = {};
  function getEncoding (extension) {
    if (options.enc) {
      return options.enc[extension];
    } else {
      return options['encDefault'];
    }
  }

  // Setup the stream to be returned.
  return through2.obj(function (file, enc, callback) {

    if ( file.isDirectory() ) {
      //Nothing to do for directories
      return callback();
    } else if ( file.isNull() ) {
      //Ignore the empty files
      return callback();
    }
    else if ( file.isStream() ) {
      // Always error if file is a stream
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported.'));
      return callback();
    }

    try {

      if (!firstFile) {
        firstFile = true;
        base = file.base;
        cwd = file.cwd;
      }
      var key = file.relative;
      if (options['replaceSep']) {
        key = key.replace(path['sep'], options['replaceSep']);
      }
      var encoding = getEncoding(path.extname(file.path));
      if (options['encFlag']) {
        key += '|' + encoding;
      }
      result[key] = file.contents.toString(encoding);

      // Create the stream which will become the resulting JSON file
      var out = new gutil.File({
        base: base,
        cwd: cwd,
        path: path.join(file.base, dest),
        contents: new Buffer(JSON.stringify(result, null, options.space || 0))
      });

      this.push(out);
      callback();
    } catch (e) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Error:', e));
      callback(e);
    }

  });

};
