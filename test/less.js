'use strict';

require('assert');

const should = require('should');
const less = require('./../dist/less');
const vorpal = require('vorpal')();

vorpal.command('blabber').action(function (args, cb) {
  let blabber = '';
  for (let i = 0; i < 300; ++i) {
    for (let j = 0; j < 80; ++j) {
      blabber += Math.floor(Math.random() * 100);
    }
    blabber += '\n';
  }
  this.log(blabber);
  cb();
});

describe('vorpal-less', function () {
  it('should exist and be a function', function () {
    should.exist(less);
    less.should.be.type('function');
  });

  it('should import into Vorpal', function () {
    (function () {
      vorpal.use(less);
    }).should.not.throw();
  });

  it('should exist as a command in Vorpal', function () {
    let exists = false;
    for (let i = 0; i < vorpal.commands.length; ++i) {
      if (vorpal.commands[i]._name === 'less') {
        exists = true;
      }
    }
    exists.should.be.true;
  });
});
