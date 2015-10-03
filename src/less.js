'use strict';

/**
 * Module dependencies.
 */

const util = require('util');
const help = require('./help');
const slice = require('slice-ansi');

let chalk;

const utili = {

  padRows(str, n) {
    for (let i = 0; i < n; ++i) {
      str = `\n${str}`;
    }
    return str;
  },

  parseKeypress(keypress) {
    keypress.e.key = keypress.e.key || {};
    let keyValue = (util.inspect(keypress.e.value).indexOf('\\u') > -1) ? undefined : keypress.e.value;
    keyValue = (String(keyValue).trim() === '') ? undefined : keyValue;
    const ctrl = keypress.e.key.ctrl;
    const keyName = keypress.e.key.name;
    let key = keyValue || keyName;
    key = (key === 'escape') ? 'ESC' : key;
    const mods = (ctrl) ? `^${key}` : key;
    return ({
      value: key,
      mods
    });
  }
};

const less = {

  init(instance, vorpal, args, callback) {
    callback = callback || function () {};
    this.instance = instance;
    this.vorpal = vorpal;
    this.hasQuit = false;
    this.callback = callback;
    this.cursorY = 0;
    this.cursorX = 0;
    this.helpCursorY = 0;
    this.helpCursorX = 0;
    this.stdin = '';
    this.cache = '';
    this.numbers = '';
    this.prompted = false;
    this.help = help;
    this.onlyHelp = (args.options.help);
    this.helpMode = (args.options.help);
    this.quitIfOneScreen = (args.options.quitifonescreen);
    const self = this;
    this.keypressFn = function (e) {
      self.onKeypress(e);
    };
    this.vorpal.on('keypress', this.keypressFn);
    return this;
  },

  exec(args) {
    const stdin = args.stdin || '';
    this.stdin += `${stdin}\n`;
    const content = this.prepare();
    if (this.hasQuit) {
      return;
    }
    if (!this.prompted) {
      this.prompt();
    }
    this.render(content);
  },

  prepare() {
    const self = this;
    let stdins = (this.helpMode) ? this.help : String(this.stdin);
    const cursorY = (this.helpMode) ? this.helpCursorY : this.cursorY;
    const cursorX = (this.helpMode) ? this.helpCursorX : this.cursorX;
    const lines = stdins.split('\n').length;
    const height = process.stdout.rows - 1;
    const diff = height - lines;
    if (diff > 0 && !this.quitIfOneScreen) {
      stdins = utili.padRows(stdins, diff);
    }
    stdins = stdins.split('\n').slice(cursorY, cursorY + height).map(function (str) {
      str = slice(str, cursorX, cursorX + process.stdout.columns - 1);
      return str;
    }).join('\n');
    if (this.quitIfOneScreen && diff > 0) {
      // If we're logging straight, we want to remove the last \n, 
      // as console.log takes care of that for us.
      stdins = (stdins[stdins.length - 1] === '\n') ? stdins.slice(0, stdins.length - 1) : stdins;
      self.vorpal.log(stdins);
      this.quit({
        redraw: false
      });
      return undefined;
    }
    return stdins;
  },

  render(data) {
    this.vorpal.ui.redraw(data);
  },

  onKeypress(keypress) {
    const height = process.stdout.rows - 1;
    const width = process.stdout.columns - 1;
    const stdin = (this.helpMode) ? this.help : String(this.stdin);
    const lines = String(stdin).split('\n').length;
    const bottom = ((lines - height) < 0) ? 0 : (lines - height);
    const key = utili.parseKeypress(keypress);
    const keyCache = this.cache + key.value;
    const alphaCache = String(keyCache).replace(/^[0-9]+/g, '');
    const numCache = String(keyCache).replace(/[^0-9]/g, '');
    const factor = (!isNaN(numCache) && numCache > 0) ? parseFloat(numCache) : 1;

    const cursorYName = (this.helpMode) ? 'helpCursorY' : 'cursorY';
    const cursorXName = (this.helpMode) ? 'helpCursorX' : 'cursorX';
    let cursorY = this[cursorYName];
    let cursorX = this[cursorXName];
    const startedBelowBottom = (cursorY > bottom);
    const ignore = ['backspace', 'left', 'right', '`', 'tab'];
    const flags = {
      match: true,
      stop: true,
      version: false
    };

    function has(arr) {
      arr = (Array.isArray(arr)) ? arr : [arr];
      return (arr.indexOf(key.value) > -1 || arr.indexOf(alphaCache) > -1 || arr.indexOf(key.mods) > -1);
    }

    if (has(['ESC ', 'ESCspace'])) {
      cursorY += (height * factor);
      flags.stop = false;
    } else if (has(['up', 'y', '^Y', 'k', '^K', '^p'])) {
      cursorY -= factor;
    } else if (has(['down', 'e', '^e', '^n', 'j', 'enter'])) {
      cursorY += factor;
    } else if (has(['left'])) {
      cursorX -= (Math.floor(width / 2) * factor);
    } else if (has(['right'])) {
      cursorX += (Math.floor(width / 2) * factor);
    } else if (has(['pageup', 'b', '^B', 'ESCv', 'w'])) {
      cursorY -= (height * factor);
    } else if (has(['pagedown', 'f', '^F', '^v', 'space', ' ', 'z'])) {
      cursorY += (height * factor);
    } else if (has(['u', '^u'])) {
      cursorY -= (Math.floor(height / 2) * factor);
    } else if (has(['d', '^d'])) {
      cursorY += (Math.floor(height / 2) * factor);
    } else if (has(['g', 'home', '<', 'ESC<'])) {
      cursorY = 0;
    } else if (has(['p', '%'])) {
      const pct = (factor > 100) ? 100 : factor;
      cursorY = (pct === 1) ? 0 : Math.floor(lines * (pct / 100));
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

    this.cache = (!flags.match) ? keyCache : '';
    cursorX = (cursorX < 0) ? 0 : cursorX;
    cursorY = (cursorY < 0) ? 0 : cursorY;
    cursorY = (cursorY > bottom && flags.stop && !startedBelowBottom) ? bottom : cursorY;

    let delimiter;
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
    this[cursorYName] = cursorY;
    this[cursorXName] = cursorX;

    const content = this.prepare();
    if (!this.hasQuit) {
      this.vorpal.ui.delimiter(delimiter);
      this.render(content);
      if (cursorY < bottom && !this.helpMode) {
        this.vorpal.ui.input(this.cache);
      } else {
        this.vorpal.ui.input('');
      }
    }
  },

  quit(options) {
    const self = this;
    self.hasQuit = true;
    options = options || {
      redraw: true
    };

    function end() {
      self.vorpal.removeListener('keypress', self.keypressFn);
      if (options.redraw) {
        self.vorpal.ui.submit('');
        self.vorpal.ui.redraw.clear();
        self.vorpal.ui.redraw.done();
      }
      self.callback();
    }

    // Wait for the prompt to render.
    function wait() {
      if (!self.vorpal.ui._activePrompt) {
        setTimeout(wait, 10);
      } else {
        end();
      }
    }

    wait();
  },

  prompt() {
    this.prompted = true;
    const self = this;

    // For now, ensure we aren't stuck
    // on Vorpal's last prompt.
    if (self.vorpal.ui._activePrompt) {
      delete self.vorpal.ui._activePrompt;
    }

    this.instance.prompt({
      type: 'input',
      name: 'continue',
      message: ':',
      validate() {
        // By validating false, and sending
        // a keypress event, we can bypass the
        // enter key's default inquirer actions
        // and treat it like it's just another key.
        self.onKeypress({
          e: {key: {name: 'enter'}}
        });
        return false;
      }
    }, function () {});
  }
};

/**
 * Expose a function that passes in a Vantage
 * object and options.
 */

module.exports = function (vorpal) {
  chalk = vorpal.chalk;

  function route(args, cb) {
    cb = cb || function () {};
    if (this._less && this._less.hasQuit === true) {
      args.stdin = (Object.prototype.toString.call(args.stdin) === '[object Array]') ? args.stdin[0] : args.stdin;
      if (this._less.quitIfOneScreen && args.stdin && args.stdin !== '') {
        vorpal.log(args.stdin);
      }
      cb();
      return;
    }
    if (!this._less) {
      this._less = Object.create(less);
      this._less.init(this, vorpal, args, cb);
      this._less.exec(args);
    } else {
      this._less.exec(args);
      cb();
    }
  }

  vorpal
    .command('less', 'Less implementation.')
    .option('-F, --quit-if-one-screen')
    .hidden()
    .help(route)
    .action(route);
};
