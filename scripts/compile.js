//Import dependencies
var gulp = require('gulp');
var rename = require("gulp-rename");
var handlebars = require('gulp-compile-handlebars');
var utily = require('utily');
var logty = require('logty');

//Get the new logty instance
var log = new logty(null);

//Pipe to the console
log.pipe(process.stdout);

//Display in logs
log.debug('Reading icons file...');

//Read the icons files
utily.json.read('./icons.json', function(error, icons)
{
  //Check the error
  if(error){ throw error; }

  //Display the number of icons in console
  log.info('Read ' + icons.length + ' icons');

  //Initialize the handlebars options
  var options = { helpers: {} };

  //Add the unicode parser helper
  options.helpers.unicode_parser = function(value)
  {
    //Return the parsed unicode value
    return value.toString(16).toLowerCase();
  };

  //Display in console
  log.info('Generating SCSS files...');

  //Select the scss templates
  gulp.src('./templates/**.scss.handlebars')

  //Compile using handlebars and rename the output files
  .pipe(handlebars({ icons: icons }, options))

  //Remove the hbs extension
  .pipe(rename({ extname: '' }))

  //Save to the scss folder
  .pipe(gulp.dest('./scss').on('finish', function()
  {
    //Display in console
    log.info('Compiled files saved in ./scss folder')
  }));
});
