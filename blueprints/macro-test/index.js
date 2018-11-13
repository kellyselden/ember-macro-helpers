'use strict';

const testInfo = require('ember-cli-test-info');
const { dasherize } = require('ember-cli-string-utils');

module.exports = {
  description: 'Generates a computed macro unit test.',

  locals(options) {
    return {
      friendlyTestName: testInfo.name(options.entity.name, 'Unit', 'Macro'),
      dasherizedModulePrefix: dasherize(options.project.config().modulePrefix)
    };
  }
};
