var path = require("path");
var webpack = require('webpack');
var env = "PROD";


module.exports = {
    entry: {
        app: ["./src/entry.js"]
    },
    output: {
        path: path.join(__dirname, "/app/static/build"),
        publicPath: "/app/static/build",
        filename: "bundle.min.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            sourcemap: false,
            compress: {
                warnings: false,
            }
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: (env == "DEV") ? ['es2015', 'react', 'react-hmre'] : ['es2015', 'react'],
                    plugins: ["transform-object-rest-spread"]
                }
            },
            {
                test: /\.(sass|scss)$/,
                loaders: ["style", "css", "sass?includePaths[]=./node_modules/bootstrap-sass/assets/stylesheets"]
            },
            {
                test: /\.css$/, loader: "style-loader!css-loader"
            },

            {
                test: /\.less$/, loader: "style-loader!css-loader!less-loader"
            },

            {
                test: /\.gif$/, loader: "url-loader?mimetype=image/png"
            },

            {
                test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff"
            },

            {
                test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]"
            },

        ]
    }
};