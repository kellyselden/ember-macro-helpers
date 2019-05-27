'use strict';

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
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

  async function _readFile(fileName) {
    return await readFile(path.join(fixturesPath, fileName), 'utf8');
  }

  function test(fileName, ...args) {
    it([blueprint, macro, ...args].join(' '), async function() {
      args = [blueprint, dasherize(macro), ...args];

      await emberNew();

      await emberGenerateDestroy(args, async file => {
        expect(file(filePath)).to.equal(await _readFile(fileName));
      });
    });
  }

  describe(describeTitle, function() {
    setupTestHooks(this);

    callback(test);
  });
};
