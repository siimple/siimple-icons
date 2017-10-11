//Import dependencies
var fs = require('fs');
var path = require('path');

//Line break
var endl = '\n';

//Tabular character
var tab = ' ';

//Icons folder
var icons_folder = './svg/';

//Read the svg icons folder
fs.readdir(icons_folder, function(error, files)
{
  //Check the error
  if(error){ throw error; }

  //Initialize the unicode counter
  var icon_unicode = 57344;

  //Initialize the writable stream
  var writable = fs.createWriteStream('./icons.json', { encoding: 'utf8' });

  //Writable finish event
  writable.on('finish', function()
  {
    //Display done
    console.log('File created!');
  });

  //Initialize the output file
  writable.write('[' + endl);

  //For each file in the list
  files.forEach(function(file)
  {
    //Check the icon extension
    if(path.extname(file) !== '.svg'){ return; }

    //Check for first item
    if(counter > 0)
    {
      //Add the comma and a new line break
      writable.write(',' + endl);
    }

    //Get the icon id
    var icon_id = path.basename(file, '.svg');

    //Get the icon path
    var icon_path = path.join(icons_folder, file);

    //Write the file information
    writable.write(tab + '{ "id": "' + icon_id + '", "unicode": ' + icon_unicode + ', "path": "' + icon_path + '" }');

    //Increment the counter
    icon_unicode = icon_unicode + 1;
  });

  //End the writable file
  writable.end(endl + ']' + endl);
});