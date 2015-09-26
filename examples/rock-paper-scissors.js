'use strict';

const chalk = require('chalk');
const vorpal = require('vorpal')();
const less = require('./../dist/less');

vorpal
  .delimiter(`${chalk.grey(`type "${chalk.blue(`rock-paper-scissors | less`)}":`)}`)
  .use(less)
  .show();

vorpal.command('rock-paper-scissors', 'Spits an epic set of data to less.')
  .action(function (args, cb) {
    function gen() {
      const rand1 = ['rock', 'paper', 'scissors']['012'.charAt(Math.floor(Math.random() * 3))];
      const rand2 = ['blue', 'white', 'yellow', 'red', 'magenta', 'green', 'cyan']['0123456'.charAt(Math.floor(Math.random() * 7))];
      return `${chalk[rand2](rand1)} `;
    }
    let out = '';
    for (let i = 0; i < 500; ++i) {
      out += `${(i + 1)}: `;
      for (let j = 0; j < Math.floor((Math.random() * 20) * (Math.random() * 100)); ++j) {
        out += gen(j + 1);
      }
      out += (i === 499) ? '' : '\n';
    }
    this.log(out);
    cb();
  });
