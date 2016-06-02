'use strict';

// Depends
var path = require('path');
var webpack = require('webpack');
var Manifest = require('manifest-revision-webpack-plugin');

var TextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var discardDuplicates = require('postcss-discard-duplicates');
var discardComments = require('postcss-discard-comments');

var HtmlPlugin = require('html-webpack-plugin');

/**
 * Global webpack config
 * @param  {[type]} _path [description]
 * @return {[type]}       [description]
 */
module.exports = function (_path) {
    // define local variables
    var rootAssetPath = _path + 'app';

    // return objecy
    return {
        // entry points
        entry: {
            application: _path + '/app/index.js',
            vendors: ['jquery', 'lodash',
                'angular',
                'angular-messages',
                'angular-animate',
                'angular-ui-router',
                'angular-ui-mask',
                'angular-translate',
                'angular-translate-loader-static-files',
                'restangular',
                'angular-sanitize',
                'angulartics',
                'angulartics-google-analytics',
                'angulartics-piwik'
            ]
        },

        // output system
        output: {
            path: path.join(_path, 'dist'),
            filename: path.join('assets', 'js', '[name].bundle.[chunkhash].js'),
            chunkFilename: '[id].bundle.[chunkhash].js',
            publicPath: '/'
        },

        // resolves modules
        resolve: {
            extensions: ['', '.js'],
            modulesDirectories: ['node_modules'],
            alias: {
                _svg: path.join(_path, 'app', 'assets', 'svg'),
                _data: path.join(_path, 'app', 'data'),
                _fonts: path.join(_path, 'app', 'assets', 'fonts'),
                _modules: path.join(_path, 'app', 'modules'),
                _pages: path.join(_path, 'app', 'pages'),
                _images: path.join(_path, 'app', 'assets', 'images'),
                _stylesheets: path.join(_path, 'app', 'assets', 'stylesheets'),
                _templates: path.join(_path, 'app', 'assets', 'templates')
            }
        },

        // resolve loaders
        resolveLoader: {
            modulesDirectories: ['node_modules'],
            moduleTemplates: ['*-loader', '*'],
            extensions: ['', '.js']
        },

        // modules resolvers
        module: {
            loaders: [
                {
                    test: /jquery\.js$/,
                    loader: 'expose?jQuery'
                },
                {
                    test: /\.html$/,
                    loader: "ng-cache?prefix=[dir]/[dir]"
                },
                {
                    test: /\.css/,
                    loader: TextPlugin.extract('style', 'css')
                },
                {
                    test: /\.sass$/,
                    loader: TextPlugin.extract('style', 'css?sourceMap!postcss!sass?indentedSyntax=true&sourceComments=true')
                },
                {
                    test: /\.scss$/,
                    loader: TextPlugin.extract('style', 'css?sourceMap!postcss!sass?sourceComments=true')
                },
                {
                    test: /\.(ttf|eot|woff|woff2|png|jpg|jpeg|gif|svg)$/i,
                    loaders: ['file?context=' + rootAssetPath + '&name=assets/static/[ext]/[name].[hash].[ext]']
                },
                {
                    test: /\.ico$/,
                    loader: 'file?name=[name].[ext]'
                },
                {
                    test: /\.(json)$/i,
                    loaders: ['file?context=' + rootAssetPath + '&name=data/[name].[ext]']
                },
                //Font awesome loader config
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])$/,
                    loaders: ['file?context=' + rootAssetPath + '&name=assets/static/[ext]/[name].[hash].[ext]']
                }
            ]
        },
        sassLoader: {
            precision: 8
        },
        // post css
        postcss: [autoprefixer({browsers: ['last 5 versions']})],
        //Add to prod env
        //postcss: [autoprefixer({browsers: ['last 5 versions']}), discardDuplicates, discardComments],

        // load plugins
        plugins: [
            new webpack.EnvironmentPlugin('NODE_ENV'),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            }),
            new CopyWebpackPlugin([
                {from: 'app/assets/iframes', to: 'assets/iframes'},
                {from: 'app/assets/locale', to: 'angular/i18n'}
            ]),

            new webpack.optimize.CommonsChunkPlugin('vendors', 'assets/js/vendors.[chunkhash].js'),
            new TextPlugin('assets/css/[name].[chunkhash].css'),
            new Manifest(path.join(_path + '/config', 'manifest.json'), {
                rootAssetPath: rootAssetPath,
                ignorePaths: ['.DS_Store']
            }),
            // create instance for entrypoint index.html building
            new HtmlPlugin({
                title: 'SendUa',
                chunks: ['application', 'vendors'],
                filename: 'index.html',
                template: path.join(_path, 'app', 'assets', 'templates', 'index.html')
            })
        ]
    };
};
