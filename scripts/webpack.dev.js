const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './main.js',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname,'..', 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
     title: 'Development',
     template:  path.resolve(__dirname, '../', 'index.html')
    }),
  ],
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'createElement',
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
