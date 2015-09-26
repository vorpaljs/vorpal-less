const chalk = require('chalk');

function b(str) {
  return chalk.blue(str);
}

function y(str) {
  return chalk.yellow(str);
}

function r(str) {
  return chalk.red(str);
}

function c(str) {
  return chalk.cyan(str);
}

function g(str) {
  return chalk.grey(str);
}

function bold(str) {
  return chalk.bold(str);
}

const help =
`
                     ${bold(`SUMMARY OF LESS COMMANDS`)}

        Commands marked with * may be preceded by a number, N.
        Notes in parentheses indicate the behavior if N is given.
        A key preceded by a caret indicates the Ctrl key; thus ^K is ctrl-K.

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

    -<flag>              Toggle a command line option [see OPTIONS below].
    --<name>             Toggle a command line option, by name.
    _<flag>              Display the setting of a command line option.
    __<name>             Display the setting of an option, by name.

    V                    Print version number of "less".
   ${g(`---------------------------------------------------------------------------`)}

                             ${bold(`OPTIONS`)}

          Most options may be changed either on the command line,
          or from within less by using the - or -- command.
          Options may be given in one of two forms: either a single
          character preceded by a -, or a name preceded by --.

    -?  ........  --help
                    Display help (from command line).
    -a  ........  --search-skip-screen
                    Search skips current screen.
    -A  ........  --SEARCH-SKIP-SCREEN
                    Search starts just after target line.
    -b [N]  ....  --buffers=[N]
                    Number of buffers.
    -B  ........  --auto-buffers
                    Don't automatically allocate buffers for pipes.
    -c  ........  --clear-screen
                    Repaint by clearing rather than scrolling.
    -d  ........  --dumb
                    Dumb terminal.
    -D [xn.n]  .  --color=xn.n
                    Set screen colors. (MS-DOS only)
    -e  -E  ....  --quit-at-eof  --QUIT-AT-EOF
                    Quit at end of file.
    -f  ........  --force
                    Force open non-regular files.
    -F  ........  --quit-if-one-screen
                    Quit if entire file fits on first screen.
    -g  ........  --hilite-search
                    Highlight only last match for searches.
    -G  ........  --HILITE-SEARCH
                    Don't highlight any matches for searches.
    -h [N]  ....  --max-back-scroll=[N]
                    Backward scroll limit.
    -i  ........  --ignore-case
                    Ignore case in searches that do not contain uppercase.
    -I  ........  --IGNORE-CASE
                    Ignore case in all searches.
    -j [N]  ....  --jump-target=[N]
                    Screen position of target lines.
    -J  ........  --status-column
                    Display a status column at left edge of screen.
    -k [file]  .  --lesskey-file=[file]
                    Use a lesskey file.
    -K            --quit-on-intr
                    Exit less in response to ctrl-C.
    -L  ........  --no-lessopen
                    Ignore the LESSOPEN environment variable.
    -m  -M  ....  --long-prompt  --LONG-PROMPT
                    Set prompt style.
    -n  -N  ....  --line-numbers  --LINE-NUMBERS
                    Don't use line numbers.
    -o [file]  .  --log-file=[file]
                    Copy to log file (standard input only).
    -O [file]  .  --LOG-FILE=[file]
                    Copy to log file (unconditionally overwrite).
    -p [pattern]  --pattern=[pattern]
                    Start at pattern (from command line).
    -P [prompt]   --prompt=[prompt]
                    Define new prompt.
    -q  -Q  ....  --quiet  --QUIET  --silent --SILENT
                    Quiet the terminal bell.
    -r  -R  ....  --raw-control-chars  --RAW-CONTROL-CHARS
                    Output "raw" control characters.
    -s  ........  --squeeze-blank-lines
                    Squeeze multiple blank lines.
    -S  ........  --chop-long-lines
                    Chop (truncate) long lines rather than wrapping.
    -t [tag]  ..  --tag=[tag]
                    Find a tag.
    -T [tagsfile] --tag-file=[tagsfile]
                    Use an alternate tags file.
    -u  -U  ....  --underline-special  --UNDERLINE-SPECIAL
                    Change handling of backspaces.
    -V  ........  --version
                    Display the version number of "less".
    -w  ........  --hilite-unread
                    Highlight first new line after forward-screen.
    -W  ........  --HILITE-UNREAD
                    Highlight first new line after any forward movement.
    -x [N[,...]]  --tabs=[N[,...]]
                    Set tab stops.
    -X  ........  --no-init
                    Don't use termcap init/deinit strings.
    -y [N]  ....  --max-forw-scroll=[N]
                    Forward scroll limit.
    -z [N]  ....  --window=[N]
                    Set size of window.
    -" [c[c]]  .  --quotes=[c[c]]
                    Set shell quote characters.
    -~  ........  --tilde
                    Don't display tildes after end of file.
    -# [N]  ....  --shift=[N]
                    Horizontal scroll amount (0 = one half screen width)
        ........  --no-keypad
                    Don't send termcap keypad init/deinit strings.
        ........  --follow-name
                    The F command changes files if the input file is renamed.


   ${g(`---------------------------------------------------------------------------`)}

                            ${bold(`LINE EDITING`)}

          These keys can be used to edit text being entered
          on the "command line" at the bottom of the screen.

   RightArrow                       ESC-l     Move cursor right one character.
   LeftArrow                        ESC-h     Move cursor left one character.
   ctrl-RightArrow  ESC-RightArrow  ESC-w     Move cursor right one word.
   ctrl-LeftArrow   ESC-LeftArrow   ESC-b     Move cursor left one word.
   HOME                             ESC-0     Move cursor to start of line.
   END                              ESC-$     Move cursor to end of line.
   BACKSPACE                                  Delete char to left of cursor.
   DELETE                           ESC-x     Delete char under cursor.
   ctrl-BACKSPACE   ESC-BACKSPACE             Delete word to left of cursor.
   ctrl-DELETE      ESC-DELETE      ESC-X     Delete word under cursor.
   ctrl-U           ESC (MS-DOS only)         Delete entire line.
   UpArrow                          ESC-k     Retrieve previous command line.
   DownArrow                        ESC-j     Retrieve next command line.
   TAB                                        Complete filename & cycle.
   SHIFT-TAB                        ESC-TAB   Complete filename & reverse cycle.
   ctrl-L                                     Complete filename, list all.
`;

module.exports = help;
