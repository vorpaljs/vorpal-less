'use strict';

const chalk = require('chalk');
const vorpal = require('vorpal')();
const less = require('./../dist/less');

function rps(lines, rows) {
  function gen() {
    const rand1 = ['rock', 'paper', 'scissors']['012'.charAt(Math.floor(Math.random() * 3))];
    const rand2 = ['blue', 'white', 'yellow', 'red', 'magenta', 'green', 'cyan']['0123456'.charAt(Math.floor(Math.random() * 7))];
    return `${chalk[rand2](rand1)} `;
  }
  let out = '';
  for (let i = 0; i < lines; ++i) {
    out += `${(i + 1)}: `;
    for (let j = 0; j < rows; ++j) {
      out += gen(j + 1);
    }
    out += (i === lines - 1) ? '' : '\n';
  }
  return out;
}

vorpal
  .delimiter(`${chalk.grey(`type "${chalk.blue(`rock-paper-scissors | less`)}":`)}`)
  .use(less)
  .show();

vorpal.command('single', 'Spits an epic set of single-page data to less.')
  .alias('s')
  .parse(function (str) {
    return `${str} | less -F`;
  })
  .action(function (args, cb) {
    this.log(rps(20, 5));
    cb();
  });

vorpal.command('rock-paper-scissors', 'Spits an epic set of data to less.')
  .alias('b')
  .action(function (args, cb) {
    this.log(rps(500, Math.floor((Math.random() * 20) * (Math.random() * 50))));
    cb();
  });
