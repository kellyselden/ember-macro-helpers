/*jshint node:true*/
var testInfo = require('ember-cli-test-info');
var stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: 'Generates a computed macro unit test.',

  locals: function(options) {
    return {
      friendlyTestName: testInfo.name(options.entity.name, 'Unit', 'Macro'),
      dasherizedModulePrefix: stringUtils.dasherize(options.project.config().modulePrefix)
    };
  },

  afterInstall: function() {
    // >= 2.11
    // return this.addAddonToProject('ember-macro-test-helpers');
    // https://github.com/ember-cli/ember-cli/issues/6318
    return this.addAddonsToProject({
      packages: ['ember-macro-test-helpers'],
      blueprintOptions: { saveDev: true }
    });
  }
};
