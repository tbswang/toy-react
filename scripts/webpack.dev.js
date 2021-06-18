const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    // index: './main.js',
    index: './didact/demo.js',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: path.resolve(__dirname, '../', 'index.html'),
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
        test: /\.js|\.tsx$/,
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
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false,
  },
};
