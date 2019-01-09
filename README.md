# Javascript Deobfuscator

Need to edit an obfuscated Javascript? This repo is the way to de-obfuscate any kind of obfuscated Javascript (especially if it comes from automatic tools like https://javascriptobfuscator.com/).

The process is not automatic, but the tools should be enough.

## Buttons:

#### Eval

Evaluate selected code and returns the stringified JSON of the object.

`(() => "\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74")()` => `"use strict"`

#### Eval Strings

Like Eval, but only evaluate contents in inside of each double quotes of selected code.

`function() { return ["\x75","\x66","\x73"].join(); }` => `function() { return ["u","f","s"].join(); }`

#### Expand Bracket

Expands the cursor to select pair of bracket.

`[|'a', 'b']` => `|['a', 'b']|` (in this example, bar | denotes cursor location)

#### Array Subtitution

Subtitute selected array to whole code. Remember the array should be selected before doing this operation (pair `[` to `]`).

`var exts=['body', 'style', 'color', 'black']; document[exts[0]][exts[1]][exts[2]]=exts[3];` => `document["body"]["style"]["color"]="black";`

#### Simplify Access

Normalizing variable access if possible in selected or whole code.

`document["body"]["style"]["color"]="black";` => `document.body.style.color="black";`

#### Format

Beautify javascript.

#### Other Operations.

The editor code uses [monaco-editor](https://microsoft.github.io/monaco-editor/) library, which powers Visual Studio Code. You can do similar operations like Find (`Ctrl+F`), Replace (`Ctrl+H`), Jump (`Ctrl+G`), and many others including opening whole other pallettes by pressing `F1`.

Feel free to requests other operation ideas in Issue Tracker.
