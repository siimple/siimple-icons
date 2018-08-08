let fs = require("fs");
let path = require("path");

process.nextTick(function () {
    //Global configuration
    let iconsFolder = "./svg/";
    let iconsFile = "./icons.json";
    let unicodeStart = 57344;
    //Read the icons folder
    return fs.readdir(iconsFolder, function (error, files) {
        if (error) {
            process.stderr.write("ERROR: " + error.message);
            return process.exit(1);
        }
        let icons = [];
        let iconUnicode = unicodeStart;
        // For each file in the list
        files.forEach(function (file) {
            // Check if the file has svg extension
            if (path.extname(file) === ".svg") {
                let icon = {
                    "id": path.basename(file, ".svg"),
                    "path": path.join(iconsFolder, file),
                    "unicode": iconUnicode,
                    "added": "v0.0.1",
                    "updated": "v0.0.1"
                };
                icons.push(icon);
                //Increment the unicode counter
                iconUnicode = iconUnicode + 1;
            }
        });
        //Convert the icons list to string
        let content = JSON.stringify(icons, null, 4);
        //Write to the JSON file
        return fs.writeFile(iconsFile, content, "utf8", function (error) {
            if (error) {
                process.stderr.write("ERROR: " + error.message);
                return process.exit(1);
            }
            return process.exit(0);
        }); 
    });
});

