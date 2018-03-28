/*global module: true*/
/*global require: true*/

module.exports = require('babel-jest').createTransformer({
  presets: ['env', 'react'],
});
