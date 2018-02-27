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
            let filePath = path.join(process.cwd(), files[index]);
            let fileObj = path.parse(filePath);
            tasks.logger.log("Compiling file " + filePath);
            //Read the file content
            return fs.readFile(filePath, "utf8", function(error, content){
                if(error) {
                    return done(error);
                }
                //Compile the test file
                let template = handlebars.compile(content);
                let resultContent = template(data);
                //Output file path
                let resultObj = {dir: fileObj.dir, name: fileObj.name, ext: ".html"};
                let resultPath = path.format(resultObj);
                tasks.logger.log("Saving compiled test to " + resultPath);
                return fs.writeFile(resultPath, resultContent, "utf8", function(error){
                    if(error) {
                        return done(error);
                    }
                    //File completed, next file on the list
                    return compileFile(index + 1);
                });
            });
        };
        return compileFile(0);
    });
});

//Run the tasks
tasks.run();
