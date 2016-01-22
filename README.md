# Vorpal - Less

[![Build Status](https://travis-ci.org/vorpaljs/vorpal-less.svg)](https://travis-ci.org/vorpaljs/vorpal-less)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

A 100% Javascript (ES2015) implementation of the [less](https://en.wikipedia.org/wiki/Less_%28Unix%29) command.

A [Vorpal.js](https://github.com/dthree/vorpal) extension, `vorpal-less` lets you pipe vorpal commands and content through less.

### Installation

```bash
npm install vorpal-less
npm install vorpal
```

### Getting Started

```js
const vorpal = require('vorpal')();
const hn = require('vorpal-hacker-news');
const less = require('vorpal-less');

vorpal
  .delimiter('node~$')
  .use(hn)
  .use(less)
  .show();
```

```bash
$ node hacker-news.js
node~$ hacker-news | less
...
... content
...
:
```

### Examples

- [Hackers News](https://github.com/vorpaljs/vorpal-less/blob/master/examples/hacker-news.js)
- [Rock Paper Scissors](https://github.com/vorpaljs/vorpal-less/blob/master/examples/rock-paper-scissors.js)

### Implementation

`vorpal-less` aims to be a letter-perfect implementation of the `less` command you know (and love?). All features implemented so far will appear in its help menu:

```bash
vorpal~$ less --help
```
##### Implemented:

- Primary functionality, prompt, screen writing, etc.
- All navigation commands and shortcuts.
- Less-style help menu.

### Contributing

Feel free to contribute! Additional work is needed on:

- Search options
- File-reading options
- Option flags

### License

MIT © [David Caccavella](https://github.com/dthree)

