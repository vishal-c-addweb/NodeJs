const nodeExternals = require('webpack-node-externals');
var glob = require("glob");

const path = require( 'path' );

module.exports = {

    target: 'node',

    externals: [nodeExternals()],

    // bundling mode
    mode: 'development',

    // entry files
    entry: glob.sync("./src/*.ts"),

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: '[name].js',
    },

    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js' ],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
};