//Import dependencies
var gulp = require('gulp');
var rename = require("gulp-rename");
var handlebars = require('gulp-compile-handlebars');
var utily = require('utily');

//Read the icons files
utily.json.read('./icons.json', function(error, icons)
{
  //Check the error
  if(error){ throw error; }

  //Initialize the handlebars options
  var options = { helpers: {} };

  //Add the unicode parser helper
  options.helpers.unicode_parser = function(value)
  {
    //Return the unicode value parsed
    //return '\\' + value.toString(16).toUpperCase();
    return value;
  };

  //Select the scss templates
  gulp.src('./templates/**.scss.handlebars')

  //Compile using handlebars and rename the output files
  .pipe(handlebars({ icons: icons }, options))

  //Remove the hbs extension
  .pipe(rename({ extname: '' }))

  //Save to the scss folder
  .pipe(gulp.dest('./scss'));
});
