const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup/popup.js',
    background: './src/background/background.js',
    transcriber: './src/lib/transcriber.js',
    textProcessor: './src/lib/textProcessor.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/popup/popup.html", to: "popup.html" },
        { from: "src/popup/popup.css", to: "popup.css" },
        { from: "src/assets", to: "assets" },
        { from: "manifest.json", to: "manifest.json" }
      ],
    }),
  ],
}; 