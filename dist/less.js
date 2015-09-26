'use strict';

/**
 * Module dependencies.
 */

var chalk = require('chalk');
var util = require('util');
var help = require('./help');
var slice = require('slice-ansi');

var utili = {

  padRows: function padRows(str, n) {
    for (var i = 0; i < n; ++i) {
      str = '\n' + str;
    }
    return str;
  },

  parseKeypress: function parseKeypress(keypress) {
    keypress.e.key = keypress.e.key || {};
    var keyValue = util.inspect(keypress.e.value).indexOf('\\u') > -1 ? undefined : keypress.e.value;
    keyValue = String(keyValue).trim() === '' ? undefined : keyValue;
    var ctrl = keypress.e.key.ctrl;
    var keyName = keypress.e.key.name;
    var key = keyValue || keyName;
    key = key === 'escape' ? 'ESC' : key;
    var mods = ctrl ? '^' + key : key;
    return {
      value: key,
      mods: mods
    };
  }
};

var less = {

  init: function init(instance, vorpal, args, callback) {
    callback = callback || function () {};
    this.instance = instance;
    this.vorpal = vorpal;
    this.callback = callback;
    this.cursorY = 0;
    this.cursorX = 0;
    this.helpCursorY = 0;
    this.helpCursorX = 0;
    this.stdin = '';
    this.cache = '';
    this.numbers = '';
    this.help = help;
    this.onlyHelp = args.options.help;
    this.helpMode = args.options.help;
    this.prompt();
    var self = this;
    this.keypressFn = function (e) {
      self.onKeypress(e);
    };
    this.vorpal.on('keypress', this.keypressFn);
    return this;
  },

  exec: function exec(args) {
    var stdin = args.stdin || '';
    this.stdin += stdin + '\n';
    this.render();
  },

  render: function render(append) {
    var stdin = this.helpMode ? this.help : String(this.stdin);
    var cursorY = this.helpMode ? this.helpCursorY : this.cursorY;
    var cursorX = this.helpMode ? this.helpCursorX : this.cursorX;
    var lines = stdin.split('\n').length;
    var height = process.stdout.rows - 1;
    var diff = height - lines;
    if (diff > 0) {
      stdin = utili.padRows(stdin, diff);
    }
    stdin = stdin.split('\n').slice(cursorY, cursorY + height).map(function (str) {
      str = slice(str, cursorX, cursorX + process.stdout.columns - 1);
      return str;
    }).join('\n');
    stdin = stdin;
    this.vorpal.ui.rewrite(stdin + (append || ''));
  },

  onKeypress: function onKeypress(keypress) {
    var height = process.stdout.rows - 1;
    var width = process.stdout.columns - 1;
    var stdin = this.helpMode ? this.help : String(this.stdin);
    var lines = String(stdin).split('\n').length;
    var bottom = lines - height < 0 ? 0 : lines - height;
    var key = utili.parseKeypress(keypress);
    var keyCache = this.cache + key.value;
    var alphaCache = String(keyCache).replace(/^[0-9]+/g, '');
    var numCache = String(keyCache).replace(/[^0-9]/g, '');
    var factor = !isNaN(numCache) && numCache > 0 ? parseFloat(numCache) : 1;

    var cursorYName = this.helpMode ? 'helpCursorY' : 'cursorY';
    var cursorXName = this.helpMode ? 'helpCursorX' : 'cursorX';
    var cursorY = this[cursorYName];
    var cursorX = this[cursorXName];
    var startedBelowBottom = cursorY > bottom;
    var ignore = ['backspace', 'left', 'right', '`'];
    var flags = {
      match: true,
      stop: true,
      version: false
    };

    function has(arr) {
      arr = Array.isArray(arr) ? arr : [arr];
      return arr.indexOf(key.value) > -1 || arr.indexOf(alphaCache) > -1 || arr.indexOf(key.mods) > -1;
    }

    if (has(['ESC ', 'ESCspace'])) {
      cursorY += height * factor;
      flags.stop = false;
    } else if (has(['up', 'y', '^Y', 'k', '^K', '^p'])) {
      cursorY -= factor;
    } else if (has(['down', 'e', '^e', '^n', 'j', 'enter'])) {
      cursorY += factor;
    } else if (has(['left'])) {
      cursorX -= Math.floor(width / 2) * factor;
    } else if (has(['right'])) {
      cursorX += Math.floor(width / 2) * factor;
    } else if (has(['pageup', 'b', '^B', 'ESCv', 'w'])) {
      cursorY -= height * factor;
    } else if (has(['pagedown', 'f', '^F', '^v', 'space', ' ', 'z'])) {
      cursorY += height * factor;
    } else if (has(['u', '^u'])) {
      cursorY -= Math.floor(height / 2) * factor;
    } else if (has(['d', '^d'])) {
      cursorY += Math.floor(height / 2) * factor;
    } else if (has(['g', 'home', '<', 'ESC<'])) {
      cursorY = 0;
    } else if (has(['p', '%'])) {
      var pct = factor > 100 ? 100 : factor;
      cursorY = pct === 1 ? 0 : Math.floor(lines * (pct / 100));
    } else if (has(['G', 'end', '>', 'ESC>'])) {
      cursorY = bottom;
    } else if (has(['h', 'H'])) {
      this.helpMode = true;
    } else if (has('V')) {
      flags.version = true;
    } else if (has(['q', ':q', 'Q', ':Q', 'ZZ'])) {
      if (this.helpMode) {
        this.helpMode = false;
        if (this.onlyHelp) {
          this.quit();
          return;
        }
      } else {
        this.quit();
        return;
      }
    } else if (has(ignore)) {
      // Catch and do nothing...
    } else {
        flags.match = false;
      }

    this.cache = !flags.match ? keyCache : '';
    cursorX = cursorX < 0 ? 0 : cursorX;
    cursorY = cursorY < 0 ? 0 : cursorY;
    cursorY = cursorY > bottom && flags.stop && !startedBelowBottom ? bottom : cursorY;

    var delimiter = undefined;
    if (flags.version) {
      delimiter = chalk.inverse('vorpal-less 0.0.1 (press RETURN) ');
    } else if (cursorY >= bottom && this.helpMode) {
      delimiter = chalk.inverse('HELP -- END -- Press g to see it again, or q when done ');
    } else if (cursorY >= bottom) {
      delimiter = chalk.inverse('END ');
    } else if (this.helpMode) {
      delimiter = chalk.inverse('HELP -- Press RETURN for more, or q when done ');
    } else if (String(this.cache).trim() !== '') {
      delimiter = ' ';
    } else {
      delimiter = ':';
    }

    // Draw.
    this.vorpal.ui.delimiter(delimiter);
    this[cursorYName] = cursorY;
    this[cursorXName] = cursorX;
    this.render();
    if (cursorY < bottom && !this.helpMode) {
      this.vorpal.ui.write(this.cache);
    } else {
      this.vorpal.ui.write('');
    }
  },

  quit: function quit() {
    this.vorpal.removeListener('keypress', this.keypressFn);
    this.vorpal.ui.submit('');
    this.vorpal.ui.rewrite('');
    this.callback();
  },

  prompt: function prompt() {
    var self = this;
    var cb = function cb() {};
    this.instance.prompt({
      type: 'input',
      name: 'continue',
      message: ':',
      validate: function validate() {
        // By validating false, and sending
        // a keypress event, we can bypass the
        // enter key's default inquirer actions
        // and treat it like it's just another key.
        self.onKeypress({
          e: { key: { name: 'enter' } }
        });
        return false;
      }
    }, cb);
  }
};

/**
 * Expose a function that passes in a Vantage
 * object and options.
 */

module.exports = function (vorpal) {
  function route(args, cb) {
    cb = cb || function () {};
    if (!this._less) {
      this._less = Object.create(less);
      this._less.init(this, vorpal, args, cb);
      this._less.exec(args);
    } else {
      this._less.exec(args);
      cb();
    }
  }

  vorpal.command('less', 'Less implementation.').hidden().help(route).action(route);
};