var config = require('../')(
    'package.json',
    {x:'override.x'},
    {x:'default.x',y:'default.y'});

config.load();

console.log('nconf version from "package.json"');
console.log(config.get('dependencies:nconf'));

console.log('x from overrides');
console.log(config.get('x'));

console.log('y from defaults');
console.log(config.get('y'));
