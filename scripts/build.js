//Import dependencies
var rmr = require('rmr');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var rename = require("gulp-rename");
var SVGIcons2SVGFontStream = require('svgicons2svgfont');
var svg2ttf = require('gulp-svg2ttf');
var ttf2woff2 = require('gulp-ttf2woff2');
var ttf2woff = require('gulp-ttf2woff');
var utily = require('utily');
var keue = require('keue');
var sass = require('gulp-sass');

//Import configuration
var config = require('./config.js');

//Logger
var log = config.logger();

//Initialize the functions queue
var k = new keue(function(next)
{
  //Display in logs
  log.debug('Cleaning folder ' + config.dist);

  //Clean the dist folder
  rmr.sync(config.dist);

  //Continue with the next task
  return next();
});

//Compile SCSS files and generate the final CSS files
k.then(function(next)
{
  //Print in console
  log.debug('Building CSS files...');

  //Select all the SCSS files
  return gulp.src('scss/**/*.scss')

  //Compile the scss files
  .pipe(sass().on('error', sass.logError))

  //Pipe and save to the dist folder
  .pipe(gulp.dest(config.dist).on('finish', function()
  {
    //Print in console
    log.debug('CSS files saved in ' + config.dist);

    //Continue
    return next();
  }));
});

//Build the svg sprite
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest(config.dist);

  //Finish event
  writer.on('finish', next);

  //Get the svg files
  gulp.src('./svg/*.svg', { base: './src' })

  //Minimize each file
  .pipe(svgmin(function(file)
  {
    //Get the icon prefix
    var prefix = path.basename(file.relative, path.extname(file.relative));

    //Display in console
    //console.log('Processing ' + prefix);

    //Return the prefix plugin
    return { plugins: [ { cleanupIDs: { prefix: prefix + '-',  minify: true } } ] };
  }))

  //Build the sprite
  .pipe(svgstore())

  //Rename the output file
  .pipe(rename({ basename: 'siimple-icons' }))

  //Save the sprite image
  .pipe(writer);
});

//Build the SVG font
k.then(function(next)
{
  //Create the new font stream
  var fontStream = new SVGIcons2SVGFontStream({ fontName: 'siimple-icons', normalize: true, fontHeight: 1000 });

  //Writer stream
  var writer = fs.createWriteStream('dist/siimple-icons.font.svg');

  //Pipe the font stream
  fontStream.pipe(writer);

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
      //Get the icon path
      var icon_path = path.join('svg/', icon.id + '.svg');

      //Get the icon readable stream
      var reader = fs.createReadStream(icon_path);

      //Set the icon metadata
      reader.metadata = { unicode: [ String.fromCharCode(icon.unicode) ], name: icon.id };

      //Write the icon
      fontStream.write(reader);
    });

    //End the stream
    fontStream.end();
  });

  //Writer finished
  writer.on('finish', function(){ return next(); });
});

//Build font in ttf formt
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest(config.dist);

  //Finish event
  writer.on('finish', next);

  //Convert the svg font to ttf
  gulp.src('./dist/**.font.svg').pipe(svg2ttf()).pipe(writer);
});

//Build font in woff format
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest(config.dist);

  //Finish event
  writer.on('finish', next);

  //Convert the ttf font to woff
  gulp.src('./dist/**.font.ttf').pipe(ttf2woff()).pipe(writer);
});

//Build font in woff2 format
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest(config.dist);

  //Finish event
  writer.on('finish', next);

  //Convert the ttf font to woff2
  gulp.src('./dist/**.font.ttf').pipe(ttf2woff2()).pipe(writer);
});

//Queue finished
k.finish(function()
{
  log.debug('Build completed');
});
