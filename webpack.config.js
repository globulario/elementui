const path = require('path');

module.exports = {
    entry: './index.js',
    module: {
        rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
            { test: /\.css$/, use: ["style-loader","css-loader"] },
            { test: /\.(png|svg|jpe?g|gif|woff2?|ttf|eot)$/, use: [ 'file-loader' ] },
            {
              test: /\.s[ac]ss$/i, use: ['style-loader','css-loader','sass-loader',
              ],
            }
          ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};