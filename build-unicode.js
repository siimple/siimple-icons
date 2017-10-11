//Import dependencies
var fs = require('fs');
var path = require('path');

//Line break
var endl = '\n';

//Tabular character
var tab = ' ';

//Read the svg icons folder
fs.readdir('./svg/', function(error, files)
{
  //Check the error
  if(error){ throw error; }

  //Get the total number of files
  var files_total = files.length;

  //Files counter
  var files_counter = 0;

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

    //Get the icon id
    var id = path.basename(file, '.svg');

    //Get the unicode value
    var unicode = '&#xE' + ('00' + files_counter.toString()).slice(-3);

    //Write the file information
    writable.write(tab + '{ "id": "' + id + '", "unicode": "' + unicode + '" }');

    //Increment the files counter
    files_counter = files_counter + 1;

    //Check for the last item
    if(files_counter < files_total)
    {
      //Add the comma
      writable.write(',');
    }

    //Add the line break
    writable.write(endl);
  });

  //End the writable file
  writable.end(']' + endl);
});