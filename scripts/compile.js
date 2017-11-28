//Import dependencies
var gulp = require('gulp');
var rename = require("gulp-rename");
var handlebars = require('gulp-compile-handlebars');
var utily = require('utily');

//Import config
var config = require('./config.js');

//Initialize the new logger
var log = config.logger();

//Display in logs
log.debug('Reading icons file...');

//Read the icons files
utily.json.read('./icons.json', function(error, icons)
{
  //Check the error
  if(error){ throw error; }

  //Display the number of icons in console
  log.debug('Read ' + icons.length + ' icons');

  //Initialize the handlebars options
  var options = { helpers: {} };

  //Add the unicode parser helper
  options.helpers.unicode_parser = function(value)
  {
    //Return the parsed unicode value
    return value.toString(16).toLowerCase();
  };

  //Display in console
  log.debug('Generating SCSS files...');

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
    log.debug('Compiled files saved in ./scss folder')
  }));
});
