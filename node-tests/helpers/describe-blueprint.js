'use strict';

const path = require('path');
const readFileSync = require('fs').readFileSync;
const dasherize = require('ember-cli-string-utils').dasherize;
const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const expect = require('ember-cli-blueprint-test-helpers/chai').expect;
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

module.exports = function(
  describeTitle,
  blueprint,
  macro,
  filePath,
  callback
) {
  let fixturesPath = path.resolve('node-tests/fixtures/' + blueprint);

  function readFile(fileName) {
    return readFileSync(path.join(fixturesPath, fileName), 'utf8');
  }

  function test(fileName, args) {
    args = args || [];
    it(blueprint + ' ' + macro + (args.length ? ' ' + args.join(' ') : ''), function() {
      args = [blueprint, dasherize(macro)].concat(args);

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
