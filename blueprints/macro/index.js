'use strict';

const path = require('path');

module.exports = {
  description: 'Generates a computed macro.',

  availableOptions: [
    {
      name: 'use-curried',
      description: 'A compact way to define macros, but doesn\'t allow you to error early on invalid args.',
      type: Boolean,
      default: false
    },
    {
      name: 'use-spread',
      description: 'A convenient way to handle N number of args.',
      type: Boolean,
      default: false
    }
  ],

  filesPath(options) {
    options = options || {};
    let files = options.useCurried ? 'curried' : 'normal';
    return path.join(this.path, files);
  },

  locals(options) {
    return {
      useSpread: options.useSpread
    };
  }
};
