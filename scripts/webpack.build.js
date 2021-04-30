const path = require('path');

module.exports = {
  entry: {
    main: './main.tsx',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js|\.tsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
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
  mode: 'development',
  optimization: {
    minimize: false,
  },
};
