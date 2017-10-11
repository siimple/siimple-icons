//Import dependencies
var rmr = require('rmr');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var rename = require("gulp-rename");
var handlebars = require('gulp-compile-handlebars');
var SVGIcons2SVGFontStream = require('svgicons2svgfont');
var svg2ttf = require('gulp-svg2ttf');
var ttf2woff2 = require('gulp-ttf2woff2');
var ttf2woff = require('gulp-ttf2woff');
var utily = require('utily');

//Clean the dist folder
gulp.task('clean', function()
{
  //Clean the dist folder
  return rmr.sync('./dist');
});

//Build the font task
gulp.task('build-font-svg', function()
{
  //Create the new font stream
  var fontStream = new SVGIcons2SVGFontStream({ fontName: 'siimple-icons', normalize: true, fontHeight: 1000 });

  //Setting the font destination
  fontStream.pipe(fs.createWriteStream('dist/siimple-icons.font.svg'));

  //Error event
  fontStream.on('error', function(error){ console.log(error); });

  //Read the icons list
  utily.json.read('./icons.json', function(error, icons)
  {
    //Check the error
    if(error){ throw error; }

    //For each icon object in the list
    icons.forEach(function(icon)
    {
      //Get the icon readable stream
      var reader = fs.createReadStream(icon.path);

      //Set the icon metadata
      reader.metadata = { unicode: [ icon.unicode ], name: icon.id };

      //Write the icon
      fontStream.write(reader);
    });

    //End the stream
    fontStream.end();
  });
});

//Build font in ttf formt
gulp.task('build-font-ttf', function()
{
  //Convert the svg font to ttf
  gulp.src('./dist/siimple-icons.font.svg').pipe(svg2ttf()).pipe(gulp.dest('./dist'));
});

//Build font in woff format
gulp.task('build-font-woff', function()
{
  //Convert the ttf font to woff
  gulp.src('./dist/siimple-icons.font.ttf').pipe(ttf2woff()).pipe(gulp.dest('./dist'));
});

//Build font in woff2 format
gulp.task('build-font-woff2', function()
{
  //Convert the ttf font to woff2
  gulp.src('./dist/siimple-icons.font.ttf').pipe(ttf2woff2()).pipe(gulp.dest('./dist'));
});

//Build the svg sprite task
gulp.task('sprite', function()
{
  //Get the svg files
  gulp.src('./svg/*.svg', { base: './src' })

  //Minimize each file
  .pipe(svgmin(function(file)
  {
    //Get the icon prefix
    var prefix = path.basename(file.relative, path.extname(file.relative));

    //Display in console
    console.log('Processing ' + prefix);

    //Return the prefix plugin
    return { plugins: [ { cleanupIDs: { prefix: prefix + '-',  minify: true } } ] };
  }))

  //Build the sprite
  .pipe(svgstore())

  //Rename the output file
  .pipe(rename({ basename: 'siimple-icons' }))

  //Save the sprite image
  .pipe(gulp.dest('./dist'));
});

//Create the example files
gulp.task('examples', function()
{
  //Initialize the data object
  var data = { files: [] };

  //Get the files
  data.files = fs.readdirSync('./svg/').filter(function(el)
  {
    return el !== '.DS_Store';
  }).map(function(el)
  {
    return path.basename(el, '.svg');
  });

  //Select the templates
  gulp.src('./templates/*.handlebars')

  //Compile using handlebars
  .pipe(handlebars(data, {}))

  //Rename the files
  .pipe(rename({ extname: '.html' }))

  //Save to examples
  .pipe(gulp.dest('./examples/'));
});

//Default task
gulp.task('default', [ 'clean', 'sprite' ]);
