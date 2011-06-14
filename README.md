# About

Reconf is used in order to find a configuration file in a similar manner to how npm finds a package.json.
It will recurse up the directory tree until it finds a matching file. 
Also, it will try the user's home directory should that not succeed.

Since command line arguments and other inputs may be important to override configuration and defaults should be provided for many values, reconf will take care of these for you.
You may supply arguments to nconf to set up overriding values and defaults.
If you do not supply arguments defaults will be empty and overrides will correspond to [optimist](https://github.com/substack/node-optimist)'s argv.

# Usage

```javascript
var overrides = require('optimist').argv;
var defaults = {'angry':false};
var config = require('reconf')('.myconf',overrides,defaults)
config.load()
//
// Show the current value of the 'angry' setting
//
console.log(config.get('angry'))
```
