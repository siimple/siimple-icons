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
    let endl = "\n";
    let tab = "  ";
    //Initialize the writable stream
    let writable = fs.createWriteStream(iconsFile, {encoding: "utf8"});
    writable.on("finish", function () {
        return done();
    });
    writable.write("[" + endl);
    // For each file in the list
    icons.forEach(function (icon, index) {
        // Check if the icon is not the first icon in the list to add the comma at
        // the end of the las icon
        if (index > 0) {
            //Add the comma and a new line break
            writable.write("," + endl);
        }
        //Write the icon information
        writable.write(tab + "{\"unicode\": " + icon.unicode + ", \"id\": \"" + icon.id + "\"}");
    });
    //Finish the icons JSON file
    writable.end(endl + "]" + endl);
});

//Tasks to run
flow.defaultTask(["unicode:read", "unicode:write"]);

