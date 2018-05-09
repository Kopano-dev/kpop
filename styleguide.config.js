/*global module: true*/
/*global __dirname*/

const path = require('path');

module.exports = {
  components: 'src/**/[A-Z]*.js',
  serverHost: 'localhost',
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
          },
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules',
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
      ],
    },
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide.wrapper'),
  },
};
