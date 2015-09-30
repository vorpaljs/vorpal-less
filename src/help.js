const chalk = require('chalk');

const b = chalk.blue;
const y = chalk.yellow;
const r = chalk.red;
const c = chalk.cyan;
const g = chalk.grey;
const bold = chalk.bold;

const help =
`
                     ${bold(`SUMMARY OF LESS COMMANDS`)}

        Commands marked with ${r(`*`)} may be preceded by a number, N.
        Notes in parentheses indicate the behavior if N is given.
        A key preceded by a caret indicates the ${y(`Ctrl`)} key; thus ${y(`^`)}${b(`K`)} is ${y(`ctrl-`)}${b(`K`)}.

    ${b(`h  H            `)}     Display this help.
    ${b(`q  :q  Q  :Q  ZZ`)}     Exit.
    ${g(`---------------------------------------------------------------------------`)}

                             ${bold(`MOVING`)}

    ${b(`e  ${y(`^`)}E  j  ^N  CR  ${r(`*`)}`)}  Forward  one line   (or N lines).
    ${b(`y  ${y(`^`)}Y  k  ${y(`^`)}K  ${y(`^`)}P  ${r(`*`)}`)}  Backward one line   (or N lines).
    ${b(`f  ${y(`^`)}F  ${y(`^`)}V  ${c(`SPACE`)}  ${r(`*`)}`)}  Forward  one window (or N lines).
    ${b(`b  ${y(`^`)}B  ${c(`ESC-v`)}      ${r(`*`)}`)}  Backward one window (or N lines).
    ${b(`z                 ${r(`*`)}`)}  Forward  one window (and set window to N).
    ${b(`w                 ${r(`*`)}`)}  Backward one window (and set window to N).
    ${b(`${c(`ESC-SPACE`)}         ${r(`*`)}`)}  Forward  one window, but don't stop at end-of-file.
    ${b(`d  ${y(`^`)}D             ${r(`*`)}`)}  Forward  one half-window (and set half-window to N).
    ${b(`u  ${y(`^`)}U             ${r(`*`)}`)}  Backward one half-window (and set half-window to N).
    ${b(`${c(`ESC-`)})  ${c(`RightArrow`)} ${r(`*`)}`)}  Left  one half screen width (or N positions).
    ${b(`${c(`ESC-`)}(  ${c(`LeftArrow`)}  ${r(`*`)}`)}  Right one half screen width (or N positions).
          ---------------------------------------------------
          Default "window" is the screen height.
          Default "half-window" is half of the screen height.
    ${g(`---------------------------------------------------------------------------`)}

                             ${bold(`JUMPING`)}

    ${b(`g  <  ${c(`ESC-`)}<`)}       ${r(`*`)}  Go to first line in file (or line N).
    ${b(`G  >  ${c(`ESC-`)}>`)}       ${r(`*`)}  Go to last line in file (or line N).
    ${b(`p  %       `)}       ${r(`*`)}  Go to beginning of file (or N percent into file).
          ---------------------------------------------------

                      ${bold(`MISCELLANEOUS COMMANDS`)}

    ${b(`V`)}                    Print version number of "less".
   ${g(`---------------------------------------------------------------------------`)}

                             ${bold(`OPTIONS`)}

          Most options may be changed either on the command line,
          or from within less by using the - or -- command.
          Options may be given in one of two forms: either a single
          character preceded by a -, or a name preceded by --.

    ${b(`/?  ........  --help`)}
                    Display help (from command line).
    ${b(`-F  ........  --quit-if-one-screen`)}
                    Quit if entire file fits on first screen.


















































`;

module.exports = help;
