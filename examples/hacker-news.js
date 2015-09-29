'use strict';

const vorpal = require('vorpal')();
const chalk = require('chalk');
const hn = require('vorpal-hacker-news');
const less = require('./../dist/less');

vorpal
  .delimiter(`${chalk.grey(`type "${chalk.blue(`hacker-news -l 50 | less`)}":`)}`)
  .use(less)
  .use(hn)
  .show();

