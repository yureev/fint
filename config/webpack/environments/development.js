'use strict';

/**
 * Development config
 * @param  {String} _path Absolute path to application
 * @return {Object}       Object of development settings
 */
module.exports = function (_path) {
	return {
		context: _path,
		debug: true,
		//devtool: 'eval',
		devtool: 'source-map',
		//devtool: 'cheap-inline-module-source-map',
		devServer: {
			contentBase: './dist',
			historyApiFallback: true,
			info: true,
			hot: false,
			inline: true,
			proxy: {
				'/api/*': {
					target: 'http://0.0.0.0:3000',
					secure: false
				}
			}
		}
	}
};
