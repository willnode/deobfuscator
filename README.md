# Javascript Deobfuscator

Need to edit an obfuscated Javascript? This repo is the way to de-obfuscate any kind of obfuscated Javascript, especially if it comes from automatic tools like https://obfuscator.io/.

The process is not automatic, but the tools should be enough.

Your work is automatically saved to SessionStorage so don't worry about accidental refresh or page navigation.

## The Editor

This tool uses Monaco. The editor that powers VSCode. It itself can do Find + Replace, Undo + Redo, Syntax + Error highlighting, unused variables detection, and other neat stuff.

## Formatting Tools

All formatting tools affects selected text, or all text in editor if none selected.

#### Format Document

Beautify javascript for all text in editor.

You should format your document first before doing other tasks so it reduces chance of your code become corrupt.

#### Simplify String `simplifyString()`

This reformats string `''` and `""`. Example `"\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74"` becomes `"use strict"`.

Currently doesn't work with literal string. Also, it uses regex, so beware with complex string (e.g. `'\''`).

#### Simplify Number `simplifyNumber()`

This reformats hex number. Example `0xff` becomes `255`.

#### Simplify Object Access `simplifyAccess()`

This reformats object access. Example `document["body"]["style"]["color"]="black";` becomes `document.body.style.color="black";`

#### Simplify Hex Name `simplifyHex()`

This renames all variables `_0x[Hex code]` to it's shorter name (`a`, `b`, `c`, etc.).

Beware that this method isn't 100% safe. It can't detect any variable name collision yet.

## Evaluation Tools

This is a powerful tool to let you evaluate javascript code and reveal it's hidden content.

It's advised for you to open Browser Console (Ctrl+Shift+I, tab Console) for helpful information.

#### Push `evalPush()` and Pop `evalPop()`

Push selected text to "code stack", or pop it.

It means to be used with eval buttons (explained below). These buttons does nothing on it's own.

Pushing to code stack means if there's line `A` then you push `B`, then the current stack will be `A\nB` (A followed by B in next line).

#### Eval Selected `evalStr()`

Evaluate selected code along with current variables stack on. If it returns any valid JSON value (includes array and object) it will replaces the selected code.

A practical example is like this:

```js
var foo = {'baz' => 'bar'};
var result = foo['baz'];
```

If you push the first line to stack and then `evalStr` the text `foo['baz']`, it will replaced as `bar`.

#### Eval Auto `evalAuto()`

Harnessing the power of regex, this "intelligently" replaces any "captured" variable in the selected code, like if you do `evalStr` on each one of them. If it used correctly it will definitely saves you a lot of time.

The captured variables are based on the current stack. It will detect all `var`/`const`/`let`. If the evaluation returns string or number, it will be replaced.

## Hidden Evaluation Tools

These tools are experimental. Although it's useful in certain cases. To access it you need to call the function in browser console.

#### `evalBareStr`

Similar like `evalStr`, but without `JSON.stringify`. This is useful for extracting code out of eval string, for example.

#### `simplifyStringExp`

Similar like `simplifyString`, but also merges string concatenation (e.g. `"foo" + "bar"`). Because it's flexibility, it only detects double quote `""` right now. Proceed with caution.

#### `simplifyNumberExp`

Similar like `simplifyNumber`, but also merges number operations (e.g. `-1 + 2`). Because it's flexibility, it only detect regular number. Proceed with caution.

Feel free to requests other operation ideas in Issue Tracker.
