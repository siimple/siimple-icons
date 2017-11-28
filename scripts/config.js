//Import dependencies
var logty = require('logty');

//Exports the dist folder
module.exports.dist = './dist';

//Generate a new logger
module.exports.logger = function()
{
  //Get the new logty instance
  var log = new logty(null);

  //Pipe to the console
  log.pipe(process.stdout);

  //Return the new log object
  return log;
};
