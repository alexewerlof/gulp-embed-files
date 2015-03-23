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

##Examples and recepies

**All examples use the files in the `mydir` (directory)[https://github.com/hanifbbz/gulp-embed-files/tree/master/test/mydir]
 which contains a couple of different formats**

In the spirit of [rule of modularity](http://www.faqs.org/docs/artu/ch01s06.html) this gulp plugin
doesn't duplicate what is already possible using other gulp plugins.

All the examples have a gulpfile in the [examples directory](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/).
You can run them using `gulp --gulpfile <FILE.JS>` where `<FILE.JS>` is the name of the gulpfile from examples directory.

So let's see how it plays nicely with others in some of the common use case scenarios:

###0. Add only the text files into a json file
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


###1. Add a bunch of files into an object and assign it to a Javascript variable

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

###2. Use UMD/AMD/Global to include files

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

###3. Show the size of the resulting file

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

###4. Custom encoding for some files

```javascript
.pipe(embedFiles('output4.js', {
  //Use hex encoding instead of utf-8
  enc: {
    '.txt': 'hex'
  }
}))
});
```

See the [output](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/output4.js)

###5. Change default encoding

```javascript
gulp.src('../test/mydir/**/*.txt')
    .pipe(embedFiles('output5.json', {
      //By default use base64 encoding when the extension doesn't have a explicit definition in options.enc
      encDefault: 'base64'
    }))
```

See the [output](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/output5.js)

###6. List all the files that are being processed

You can use [gulp-debug](https://www.npmjs.com/package/gulp-debug) to get the list of files being processed for any plugin.

```javascript
.pipe(embedFiles('output0.js'))
.pipe(debug({title: 'files being embedded:'}))
```

Will output:

```
[20:24:29] files being embedded: ..\test\mydir\output6.js
[20:24:29] files being embedded: ..\test\mydir\output6.js
[20:24:29] files being embedded: 2 items
```

###7. Exclude some files

You can use the default gulp glob convention to exclude files.
Just start the globe with `!` and you're good to go:

```javascript
//Select all files from mydir except the css files
gulp.src(['../test/mydir/**/*', '!../test/mydir/**/*.css'])
    //print the list of files being fed into gulp-embed-files plugin just to be sure
    .pipe(debug())
```

Will process the following files:

```
..\test\mydir\rootfile1.txt
..\test\mydir\rootfile2.txt
..\test\mydir\binary\3d model.3DS
..\test\mydir\img\kitten.jpg
..\test\mydir\img\puppy.png
```

###8. Access the embedded files on the client

For simple text files it is very easy.
Just get the file contents like this:

```javascript
<!-- The output of the -->
<script src="output1.js"></script>
<script>
    //Create a div and put the file contents in there
    var div = document.createElement('div');
    div.innerHTML = files['rootfile1.txt'];
    document.body.appendChild(div);
</script>
```

See the [full source code](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/index8a.html)
and the [live results](http://rawgit.com/hanifbbz/gulp-embed-files/master/examples/index8a.html).

For base64 encoded files you can use the `atob()` function to decode the image data:

```javascript
var results = atob(files['img/kitten.jpg']);
//get the byte value at position pos
results.charCodeAt(pos);
```

See the [full source code](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/index8b.html)
and the [live results](http://rawgit.com/hanifbbz/gulp-embed-files/master/examples/index8b.html).

For images, you don't even need to decode base64 images. Browsers understand them out of the box.
You can also use `src="data:image/png;base64,..."`:

```javascript
var img = new Image;
img.src="data:image/png;base64," + files['img/kitten.jpg'];
document.body.appendChild(img);
```

See the [full source code](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/index8c.html)
and the [live results](http://rawgit.com/hanifbbz/gulp-embed-files/master/examples/index8c.html).

###9. Override the base directory

TODO: write me!

###10. Embed several directories

You can pass an array of directories to `gulp.src()` in order to add them.

```javascript
gulp.src(['../test/mydir/biary/**/*', '../test/mydir/img/**/*.css'])
```

See the [full source code](https://github.com/hanifbbz/gulp-embed-files/blob/master/examples/gulpfile10.js)

#Contributing

1. Fork it
2. Create your feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -m 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request

TODO: add more tests: https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/testing.md
#License

[MIT License](http://opensource.org/licenses/MIT)