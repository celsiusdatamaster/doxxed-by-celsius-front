'use strict';

module.exports = {
  compile: {
    enabled: true,
    extension: 'scss',
    map: {
      inline: false,
      annotation: true,
      sourcesContent: true,
    },
    parser: require('postcss-scss'),
    plugins: [
      {
        module: require('@csstools/postcss-sass'),
        options: {
          includePaths: ['../node_modules', 'node_modules'],
        },
      },
    ],
  },
};
