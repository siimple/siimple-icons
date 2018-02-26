var fs = require("fs");
var path = require("path");

var iconsFolder = "./svg/";
var unicodeStart = 57344;

//Read the svg icons folder
fs.readdir(iconsFolder, function (error, files) {
    //Check the error
    if (error) {
        throw error;
    }
    var endl = "\n";
    var tab = "  ";
    var iconUnicode = unicodeStart;

    //Initialize the writable stream
    var writable = fs.createWriteStream("./icons.json", {encoding: "utf8"});
    writable.on("finish", function () {
        return console.log("File created!");
    });
    writable.write("[" + endl);

    // For each file in the list
    files.forEach(function (file) {
        // Check if the file has svg extension
        if (path.extname(file) === ".svg") {
            // Check if the icon is not the first icon in the list to add the comma at
            // the end of the las icon
            if (iconUnicode > unicodeStart) {
                //Add the comma and a new line break
                writable.write("," + endl);
            }

            //Get the icon information
            var iconId = path.basename(file, ".svg");
            //var iconPath = path.join(iconsFolder, file);

            //Write the icon information
            writable.write(tab + "{\"unicode\": " + iconUnicode + ", \"id\": \"" + iconId + "\"}");
            //Increment the unicode counter
            iconUnicode = iconUnicode + 1;
        }
    });
    //Finish the icons JSON file
    writable.end(endl + "]" + endl);
});