/*global module: true*/
/*global __dirname*/

const path = require('path');

module.exports = {
  components: 'src/**/[A-Z]*.js',
  skipComponentsWithoutExample: true,
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
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules',
        },
        {
          test: /\.svg$/,
          loader: 'url-loader',
        },
      ],
    },
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide.wrapper'),
  },
};
