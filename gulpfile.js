//Import dependencies
var rmr = require('rmr');
var gulp = require('gulp');
var path = require('path');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var rename = require("gulp-rename");

//Clean the dist folder
gulp.task('clean', function()
{
  //Clean the dist folder
  return rmr.sync('./dist');
});

//Build the svg sprite task
gulp.task('build', function()
{
  //Source files
  var src = [ 'action/*.svg', 'alert/*.svg', 'navigation/*.svg' ];

  //Get the svg files
  return gulp.src(src)

  //Minimize each file
  .pipe(svgmin(function(file)
  {
    //Get the file parent folder and name
    var name = file.path.split(path.sep).slice(-2).join('-');

    //Remove the file extension
    var prefix = path.basename(name, path.extname(name));

    //Get the icon prefix
    //var prefix = path.basename(file.relative, path.extname(file.relative));

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

//Default task
gulp.task('default', [ 'clean', 'build' ]);