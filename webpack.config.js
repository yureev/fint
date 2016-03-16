'use strict';

//Depends
var _ = require('lodash');

/**
 * Exported evnironments object
 * @type {Object}
 */
var _configs = {

  //global section
  global: require(__dirname + '/config/webpack/global'),

  //config by enviroments
  production: require(__dirname + '/config/webpack/environments/production'),
  development: require(__dirname + '/config/webpack/environments/development')
};

/**
 * Load webpack config via enviroments
 * @param  {[type]} enviroment [description]
 * @return {[type]}            [description]
 */
var _load = function(environment) {

  //check enviroment
  if (!environment) throw 'Can\'t find local environment variable via process.env.NODE_ENV';
  if (!_configs[environment]) throw 'Can\'t find enviroments see _congigs object';

  //load config file by environment
  return _configs && _.merge(
    _configs['global'](__dirname),
    _configs[environment](__dirname)
  );
}

/**
 * Export WebPack config
 * @type {[type]}
 */
module.exports = _load(process.env.NODE_ENV);
