let glob = require("glob");
let handlebars = require("handlebars");

let tasks = require("./tasks.js");

//Import icons
let icons = require("../icons.json");

//Generate the scss files
tasks.task("generate:scss", function (done) {
    return glob("./scss/**.scss", function(error, files){
        if(error) {
            return done(error);
        }
        console.log(files);
        return done();
    });
});

/*
//Compile the scss templates
let compileScss = function () {
    //Build the new logty instance
    let log = new logty(null);
    log.pipe(process.stdout);
    log.debug("Reading icons file...");
    //Display the number of icons in console
    log.info("Total: " + icons.length + " icons");

    //Initialize the handlebars options
    let options = {helpers: {}};
    options.helpers.unicode_parser = function (value) {
        //Return the parsed unicode value
        return value.toString(16).toLowerCase();
    };

    //Display in console
    log.info("Generating SCSS files...");

    //Destination writer
    let dest = gulp.dest("./scss").on("finish", function () {
        log.info("Compiled files saved in ./scss folder");
        log.end();
    });

    //Compile the scss templates
    return gulp.src("./templates/**.scss.handlebars")
        .pipe(handlebars({icons: icons}, options))
        .pipe(rename({extname: ""}))
        .pipe(dest);
};
compileScss();
*/

tasks.run();
