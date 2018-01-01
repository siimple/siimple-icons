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
var logty = require('logty');

//Get the new logty instance
var log = new logty(null);

//Pipe to the console
log.pipe(process.stdout);

//Initialize the functions queue
var k = new keue(function(next)
{
  //Display in logs
  log.info('Cleaning folder ./dist');

  //Clean the dist folder
  rmr.sync('./dist/');

  //Continue with the next task
  return next();
});

//Compile SCSS files and generate the final CSS files
k.then(function(next)
{
  //Print in console
  log.info('Building CSS files...');

  //Select all the SCSS files
  return gulp.src('scss/**/*.scss')

  //Compile the scss files
  .pipe(sass().on('error', sass.logError))

  //Pipe and save to the dist folder
  .pipe(gulp.dest('./dist').on('finish', function()
  {
    //Print in console
    log.info('CSS files saved in ./dist');

    //Continue
    return next();
  }));
});

//Build the svg sprite
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest('./dist/');

  //Finish event
  writer.on('finish', next);

  //Get the svg files
  gulp.src('./svg/*.svg', { base: './src' })

  //Minimize each file
  .pipe(svgmin(function(file)
  {
    //Get the icon prefix
    var prefix = path.basename(file.relative, path.extname(file.relative));

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

//Create the fonts folder
k.then(function(next)
{
  //Print in logs
  log.info('Creating folder ./dist/fonts');

  //Create the fonts folder
  return utily.fs.mkdir('./dist/fonts', function(error)
  {
    //Check the error
    if(error){ throw error; }

    //Continue
    return next();
  });
});

//Build the SVG font
k.then(function(next)
{
  //Create the new font stream
  var fontStream = new SVGIcons2SVGFontStream({ fontName: 'SiimpleIcons', normalize: true, fontHeight: 1000 });

  //Writer stream
  var writer = fs.createWriteStream('dist/fonts/siimple-icons.font.svg');

  //Print in logs
  log.info('Creating svg font in ./dist/fonts');

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

//Build font in ttf format
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest('./dist/fonts/');

  //Print in logs
  log.info('Creating ttf font in ./dist/fonts');

  //Finish event
  writer.on('finish', next);

  //Convert the svg font to ttf
  gulp.src('./dist/fonts/**.font.svg').pipe(svg2ttf()).pipe(writer);
});

//Build font in woff format
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest('./dist/fonts/');

  //Print in logs
  log.info('Creating woff font in ./dist/fonts');

  //Finish event
  writer.on('finish', next);

  //Convert the ttf font to woff
  gulp.src('./dist/fonts/**.font.ttf').pipe(ttf2woff()).pipe(writer);
});

//Build font in woff2 format
k.then(function(next)
{
  //Output stream
  var writer = gulp.dest('./dist/fonts/');

  //Print in logs
  log.info('Creating woff2 font in ./dist/fonts');

  //Finish event
  writer.on('finish', next);

  //Convert the ttf font to woff2
  gulp.src('./dist/fonts/**.font.ttf').pipe(ttf2woff2()).pipe(writer);
});

//Queue finished
k.finish(function()
{
  log.info('Build completed');
});
