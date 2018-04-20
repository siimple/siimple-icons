let fs = require("fs");
let path = require("path");
let flow = require("tinyflow");

let icons = [];
let iconsFolder = "./svg/";
let iconsFile = "./icons.json";
let unicodeStart = 57344;

//Unicode read task
flow.task("unicode:read", function (done) {
    return fs.readdir(iconsFolder, function (error, files) {
        if (error) {
            return done(error);
        }
        let iconUnicode = unicodeStart;
        // For each file in the list
        files.forEach(function (file) {
            // Check if the file has svg extension
            if (path.extname(file) === ".svg") {
                let icon = {
                    "id": path.basename(file, ".svg"),
                    "path": path.join(iconsFolder, file),
                    "unicode": iconUnicode,
                    "since": "v0.0.1"
                };
                icons.push(icon);
                //Increment the unicode counter
                iconUnicode = iconUnicode + 1;
            }
        });
        //Task finished
        return done();
    });
});

//Unicode write task
flow.task("unicode:write", function (done) {
    //Convert the icons list to string
    let content = JSON.stringify(icons, null, 4);
    //Write to the JSON file
    fs.writeFile(iconsFile, content, "utf8", function (error) {
        return done(error);
    });
});

//Tasks to run
flow.defaultTask(["unicode:read", "unicode:write"]);

