#Introduction

Embed files into a plain javascript object for embedding in the browser

#Installation
------------

```shell
$ npm install gulp-embed-files
```

#Usage

```javascript
var embedFiles = require('gulp-embed-files');

gulp.task('embed', function() {
  return gulp.src('mydir/**/*')
    .pipe(embedFiles('files.json'))
    .pipe(gulp.dest('./dist/'));
});
```

This will create a json file that contains all files from `mydir`.
The keys are file names and the values are file contents.
The default encoding is utf8 but you have the option to provide other encodings (see options).

##Signature

```javascript
embedFiles(fileName, options);
```

##Options

###options.dest {String}

If you omit dest parameter, this parameter can be used to set dest. It's just a shorthand.

###options.space {Number=0} (0 <= space <= 10)

max 10. negative values are ignored. default to 0.
Specifies the number of spaces to insert at the beginning of every line in the resulting JSON file for readability.
It is indeed the last parameter to JSON.stringify() @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
So it can contain strings like '\t' or '  '
If it is omitted, the resulting JSON will be minified (note: make a section that describes this trick under 'minification' title)

###options.replaceSep {String} (default='/')

By default we use the unix convention with is used all around internet URLs.
With replaceSep you can specify your own custom separator.
For example if you use '__', a file that is in 'my-files/icons/arrow-down.svg' would be called 'my-files__icons__arrow-down.svg' in the resulting json.

Note: also make a section about how to use gulp-size utility to

###options.enc

Is a map of file extensions encoding string.

###Note 1: the extension should include '.' (for example '.png')

###Note 2: the extensions are case sensitive (for example if you specify the encoding for '.png', that will not affect '.pNg')

Encoding string can be any of the following (defaults to 'utf8'):

 * 'ascii' - for 7 bit ASCII data only. This encoding method is very fast, and will strip the high bit if set.
 * 'utf8' - Multibyte encoded Unicode characters. Many web pages and other document formats use UTF-8.
 * 'utf16le' - 2 or 4 bytes, little endian encoded Unicode characters. Surrogate pairs (U+10000 to U+10FFFF) are supported.
 * 'ucs2' - Alias of 'utf16le'.
 * 'base64' - Base64 string encoding.
 * 'binary' - A way of encoding raw binary data into strings by using only the first 8 bits of each character. This encoding method is deprecated and should be avoided in favor of Buffer objects where possible. This encoding will be removed in future versions of Node.
 * 'hex' - Encode each byte as two hexadecimal characters.

For more information see https://nodejs.org/api/buffer.html#buffer_buffer

###options.encDefault

Sets the default encoding for the files that are not explicitly defined in the `options.enc`.

TODO: replace this with enc.'*' for avoiding unexpected behavior and making it easier to debug.

###options.encFlag {boolean=false}

When set to true, the file names are postfixed with `|ENC` where `ENC` is the encoding according to the `options.enc` above.
This is useful when you want to parse the files on the client according to their encoding.

TODO: add an example parsing function

##Examples and recepies

**All examples use the files in the `mydir` (directory)[https://github.com/hanifbbz/gulp-embed-files/tree/master/test/mydir]
 which contains a couple of different formats**

In the spirit of [rule of modularity](http://www.faqs.org/docs/artu/ch01s06.html) this gulp plugin
doesn't duplicate what is already possible using other gulp plugins.

So let's see how it plays nicely with others in some of the common use case scenarios:

###Add only the text files into a json file
```javascript
var gulp = require('gulp');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output0.js'))
    .pipe(gulp.dest('.'));
});
```

See the [output](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/output0.js)


###Add a bunch of files into an object and assign it to a Javascript variable

```javascript
var gulp = require('gulp');
var size = require('gulp-size');
var rename = require('gulp-rename');
var wrapper = require('gulp-wrapper');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*')
    .pipe(embedFiles('output1.js', {
      space: 4,
      enc: {
        '.3DS' : 'base64',
        '.jpg' : 'base64',
        '.png' : 'base64'
      }
    }))
    .pipe(wrapper({
      //Assign the resulting object to the files variable
      header: 'var files = ',
      footer: ';'
    }))
    .pipe(gulp.dest('.'));
});
```

See the [output](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/output1.js)

###Use UMD/AMD/Global to include files

```javascript
var umd = require('gulp-umd');
var gulp = require('gulp');
var wrapper = require('gulp-wrapper');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*')
    .pipe(embedFiles('output2.js', {
      space: 4,
      enc: {
        '.3DS' : 'base64',
        '.jpg' : 'base64',
        '.png' : 'base64'
      }
    }))
    //Define a variable in the module
    .pipe(wrapper({
      header: 'var files = ',
      footer: ';'
    }))
    //Use the UMD pattern to expose it
    .pipe(umd({
      exports: function(file) {
        return 'files';
      }
    }))
    .pipe(gulp.dest('.'));
});
```

See the [output](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/output2.js)

###Show the size of the resulting file

```javascript
var gulp = require('gulp');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output5.json', {
      //By default use base64 encoding when the extension doesn't have a explicit definition in options.enc
      encDefault: 'base64'
    }))
    .pipe(gulp.dest('.'));
});
```

###Custom encoding for some files

```javascript
var gulp = require('gulp');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output4.js', {
      //Use hex encoding instead of utf-8
      enc: {
        '.txt': 'hex'
      }
    }))
    .pipe(gulp.dest('.'));
});
```

See the [output](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/output4.js)

###Change default encoding

```javascript
var gulp = require('gulp');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output5.json', {
      //By default use base64 encoding when the extension doesn't have a explicit definition in options.enc
      encDefault: 'base64'
    }))
    .pipe(gulp.dest('.'));
});
```

See the [output](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/output5.js)

###List all the files that are being processed

You can use [gulp-debug](https://www.npmjs.com/package/gulp-debug) to get the list of files being processed for any plugin.

```javascript
var gulp = require('gulp');
var debug = require('gulp-debug');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output0.js'))
    .pipe(debug({title: 'files being embedded:'}))
    .pipe(gulp.dest('.'));
});
```

Will output:

```
[20:24:29] files being embedded: ..\test\mydir\output6.js
[20:24:29] files being embedded: ..\test\mydir\output6.js
[20:24:29] files being embedded: 2 items
```

###Exclude some files

You can use the default gulp glob convention to exclude files.
Just start the globe with `!` and you're good to go:

```javascript
var gulp = require('gulp');
var debug = require('gulp-debug');
var embedFiles = require('./../index.js');

gulp.task('default', function () {
  //Exclude all the css files
  gulp.src(['../test/mydir/**/*', '!../test/mydir/**/*.css'])
    //print the list of files being fed into gulp-embed-files plugin just to be sure
    .pipe(debug())
    .pipe(embedFiles('output7.json', {
      space: 1
    }))
    .pipe(gulp.dest('.'));
});
```

Will process the following files:

```
..\test\mydir\rootfile1.txt
..\test\mydir\rootfile2.txt
..\test\mydir\binary\3d model.3DS
..\test\mydir\img\kitten.jpg
..\test\mydir\img\puppy.png
```

###Access the embedded files on the client

###Override the base directory

###Embed several directories

#Contributing

1. Fork it
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -m 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request

#License

[MIT License](http://opensource.org/licenses/MIT)