/*global module*/
'use strict';

var through2 = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var util = require('util');

module.exports = function (dest, options) {

  var PLUGIN_NAME = 'gulp-embed-files';
  if (typeof options === 'undefined') {
    if (typeof dest === 'object') {
      options = dest;
      dest = options.dest;
    } else if (typeof dest === 'string') {
      options = options || {};
    } else {
      throw new gutil.PluginError(PLUGIN_NAME, 'Invalid dest parameter: ' + dest);
    }
  }
  var DEFAULT_ENCODING = options['encDefault'] || 'utf8';
  var first = false;
  var base, cwd;
  //The file path separator
  options.replaceSep = options.replaceSep || '/';
  var result = {};
  function getEncoding (extension) {
    if (options.enc) {
      return options.enc[extension];
    } else {
      return DEFAULT_ENCODING;
    }
  }

  // Setup the stream to be returned.
  return through2.obj(function (file, enc, callback) {

    if ( file.isDirectory() ) {
      //Nothing to do for directories
      return callback();
    } else if ( file.isNull() ) {
      //The file is null? Ignore it.
      return callback();
    }
    else if ( file.isStream() ) {
      // Always error if file is a stream
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported.'));
      return callback();
    }

    try {

      if (!first) {
        first = true;
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
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Error:', e));
      callback(e);
    }

  });

};
