let fs = require("fs");
let path = require("path");
let glob = require("glob");
let handlebars = require("handlebars");

let tasks = require("./tasks.js");

//Import icons
let icons = require("../icons.json");

//Generate the test files
tasks.task("generate:tests", function (done) {
    return glob("./test/**.hbs", function(error, files){
        if(error) {
            return done(error);
        }
        tasks.logger.log("Compiling " + files.length + " files");
        let data = {icons: icons};
        let compileFile = function(index) {
            if(index >= files.length) {
                return done();
            }
            let file = path.join(process.cwd(), files[index]);
            let fileObject = path.parse(file);
            tasks.logger.log("Compiling file " + file);
            //Read the file content
            return fs.readFile(file, "utf8", function(error, content){
                if(error) {
                    return done(error);
                }
                //Compile the test file
                let template = handlebars.compile(content);
                //Output file path
                let output = path.format({dir: fileObject.dir, name: fileObject.name, ext: ".html"});
                tasks.logger.log("Saving compiled test to " + output);
                return fs.writeFile(output, template(data), "utf8", function(error){
                    if(error) {
                        return done(error);
                    }
                    //File completed, continue with the next file in the list
                    return compileFile(index + 1);
                });
            });
        };
        return compileFile(0);
    });
});

//Run the tasks
tasks.run();
