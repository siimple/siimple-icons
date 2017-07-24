//Import dependencies
var rmr = require('rmr');
var gulp = require('gulp');
var path = require('path');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var rename = require("gulp-rename");
var handlebars = require('gulp-compile-handlebars');
var fs = require('fs');

//Clean the dist folder
gulp.task('clean', function()
{
  //Clean the dist folder
  return rmr.sync('./dist');
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
