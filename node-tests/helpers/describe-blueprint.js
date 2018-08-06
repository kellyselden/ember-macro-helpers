'use strict';

const path = require('path');
const { readFileSync } = require('fs');
const { dasherize } = require('ember-cli-string-utils');
const {
  setupTestHooks,
  emberNew,
  emberGenerateDestroy
} = require('ember-cli-blueprint-test-helpers/helpers');
const { expect } = require('ember-cli-blueprint-test-helpers/chai');

module.exports = function(
  describeTitle,
  blueprint,
  macro,
  filePath,
  callback
) {
  let fixturesPath = path.resolve('node-tests/fixtures', blueprint);

  function readFile(fileName) {
    return readFileSync(path.join(fixturesPath, fileName), 'utf8');
  }

  function test(fileName, ...args) {
    it([blueprint, macro, ...args].join(' '), function() {
      args = [blueprint, dasherize(macro), ...args];

      return emberNew().then(() => {
        return emberGenerateDestroy(args, file => {
          expect(file(filePath)).to.equal(readFile(fileName));
        });
      });
    });
  }

  describe(describeTitle, function() {
    setupTestHooks(this);

    callback(test);
  });
};
