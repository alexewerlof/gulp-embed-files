#Introduction

Embed files into a plain javascript object for embedding in the browser.
If you are making a web component or simply want to make your web application efficient by minimizing unnecessary Ajax requests, this is an plugin for you.
With this plugin you can embed a bunch of files together with your javascript code to the browser and access them synchronously in no time.

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
embedFiles(dest[, options]);
```

##dest {String}

The destination file name.

##Options

An optional object with the following properties.

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

#Contributing

1. Fork it
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -m 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request

TODO: add more tests: https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/testing.md
#License

[MIT License](http://opensource.org/licenses/MIT)