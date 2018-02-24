const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    require('postcss-import'),
    autoprefixer({
      browsers: ['last 2 versions']
    }),
    require('cssnano')
  ]
};
