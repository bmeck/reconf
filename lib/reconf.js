/*
 * reconf.js: Configuration file assistance for nconf
 *
 * (C) 2011, Nodejitsu Inc.
 *
 */

var nconf = require('nconf'),
    path = require('path'),
    fs = require('fs');

var hasOwnProperty = Object.prototype.hasOwnProperty
var dir = process.cwd();

var reconf = module.exports = function reconf(filename,overrides,defaults) {
  overrides = overrides || require('optimist').argv;

  var config = Object.create(nconf.Provider.prototype);

  var path = reconf.resolve(filename,dir,defaults);
  if (path) {
    config.use('file', {file: path});
  }
  else {
    config.use('memory');
  }
  //
  // Set this afterwards so we don't create a defaults file
  //
  defaults = defaults || {};

  var _get = config.get;

  config.get = function (key) {
    if (hasOwnProperty.call(overrides, key)) {
      return overrides[key];
    }

    var value = _get.call(config, key);
    return typeof value !== 'undefined' ? value :  defaults[key];
  };

  return config;
}
//
// Make sure the file exists if it was set explicitly
//
reconf.resolve = function (filename,configPath,defaults) {
  var looking = true;
  if (configPath) {
    try {
      var stat = fs.statSync(fs.realpathSync(configPath));
      looking = stat.isDirectory();
    }
    catch (ex) {
      return false;
    }
  }
  while (looking) {
    try {
      var stat = fs.statSync(fs.realpathSync(configPath = path.join(dir, filename)));
      looking = stat.isDirectory();
    }
    catch (e) {
      var olddir = dir;
      dir = path.dirname(dir);

      if (olddir === dir) {
        try {
          var stat = fs.statSync(fs.realpathSync(configPath = path.join(process.env.HOME, filename)));
          if(stat.isDirectory()) {
            configPath = undefined;
          }
        }
        catch (e) {
          //
          // Ignore errors
          //
          configPath = undefined;
        }
        looking = false;
      }
    }
  }

  if (!configPath && defaults) {
    fs.writeFileSync(configPath = path.join(process.env.HOME, filename), JSON.stringify(defaults, null, 2));
  }

  return configPath;
};
