let fs = require("fs");
let path = require("path");
let glob = require("glob");
let handlebars = require("handlebars");

let tasks = require("./tasks.js");

//Import icons
let icons = require("../icons.json");

//Function to compile the templates
let compileTemplates = function (folder, extname, done) {
    return glob("./templates/" + folder + "/**.hbs", function(error, files){
        if(error) {
            return done(error);
        }
        tasks.logger.log("Compiling " + files.length + " files");
        let data = {icons: icons};
        let compileTemplateFile = function(index) {
            if(index >= files.length) {
                return done(null);
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
                let outputDir = path.join(process.cwd(), folder);
                let output = path.format({dir: outputDir, name: fileObject.name, ext: "." + extname});
                tasks.logger.log("Saving compiled test to " + output);
                return fs.writeFile(output, template(data), "utf8", function(error){
                    if(error) {
                        return done(error);
                    }
                    //File completed, continue with the next file in the list
                    return compileTemplateFile(index + 1);
                });
            });
        };
        return compileTemplateFile(0);
    });
};

//Generate the scss files
tasks.task("generate:scss", function (done) {
    return compileTemplates("scss", "scss", function(error){
        return done(error);
    });
});

//Generate the test files
tasks.task("generate:test", function(done){
    return compileTemplates("test", "html", function(error){
        return done(error);
    });
});

//Run all tasks
tasks.run();
