// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = 'style-loader';



const config = {
    entry: './src/code/main.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader', 'style-loader'],
            },
            {
                test:/\.html$/,
                use: {loader: "html-loader"}
            },
            {
                test: /\.tsx$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    performance:{hints: false},
    watch: true,
    devtool: "source-map",
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
        
    } else {
        config.mode = 'development';
    }
    return config;
};
