'use strict'

const webpack = require('webpack'),
      path    = require('path');

module.exports = {

  output: {
    publicPath: './dist',
    // path: path.join(__dirname, 'dist', 'js'),
    filename: 'bundle.js'
  },


  devtool: "inline-source-map",

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          ignore:  ['jquery','backbone','underscore', 'three']
        }
      },
      {
        test: /\.(ejs|html)$/,
        loader: 'text'
      }
    ]
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor",
    //   filename: "vendor.js"
    // }),
  ]
};
