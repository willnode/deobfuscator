import { editor as monacoEditor, KeyCode, KeyMod, Range } from "monaco-editor";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import "./tools.js";

/* Editor Initialization */

self.MonacoEnvironment = {
  getWorker: function () {
    return new tsWorker();
  },
};

const editor = monacoEditor.create(document.getElementById("container"), {
  value:
    sessionStorage["decoder-text"] ||
    [`function x() {`, `\tconsole['log']("Hello world!");`, `}`].join("\n"),
  language: "javascript",
  wordWrap: "on",
  automaticLayout: true,
});

window.editor = editor;

editor.getModel().onDidChangeContent(() => {
  sessionStorage["decoder-text"] = utils.text;
});

editor.addAction({
  id: "evaluate-selected",
  label: "Evaluate Selected",
  keybindings: [KeyCode.F10],
  run: function () {
    window.evalStr();
  },
});

editor.addAction({
  id: "evaluate-auto",
  label: "Auto Eval",
  keybindings: [KeyMod.CtrlCmd | KeyCode.F10],
  run: function () {
    window.evalAuto();
  },
});

editor.addAction({
  id: "object-access",
  label: "Object Access",
  keybindings: [KeyMod.CtrlCmd | KeyCode.F9],
  run: function () {
    window.simplifyAccess();
  },
});

editor.addAction({
  id: "split-var",
  label: "Split Var",
  keybindings: [KeyMod.CtrlCmd | KeyCode.F8],
  run: function () {
    window.splitVar();
  },
});
editor.addAction({
  id: "eval-push",
  label: "Eval Push",
  keybindings: [KeyCode.F9],
  run: function () {
    window.evalPush();
  },
});

editor.addAction({
  id: "eval-pop",
  label: "Eval Pop",
  keybindings: [KeyCode.F8],
  run: function () {
    window.evalPop();
  },
});

const utils = {
  transformSelection(f) {
    var selectionList = editor.getSelections();
    var model = editor.getModel();
    var ops = selectionList.map((selection, i) => {
      var text = model.getValueInRange(selection);
      var range = new Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      );
      var identifier = { major: 1, minor: i + 1 };
      var op = {
        range,
        identifier,
        text: f(text),
        forceMoveMarkers: true,
      };
      return op;
    });
    editor.executeEdits("my-source", ops);
  },
  get selectedText() {
    return editor.getModel().getValueInRange(editor.getSelection());
  },
  set selectedText(text) {
    var selection = editor.getSelection();
    var range = new Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    );
    var id = { major: 1, minor: 1 };
    var op = {
      identifier: id,
      range: range,
      text: text,
      forceMoveMarkers: true,
    };
    editor.executeEdits("my-source", [op]);
  },
  get startSelection() {
    var selection = editor.getSelection();
    return editor.getModel().getOffsetAt(selection.getStartPosition());
  },
  get endSelection() {
    var selection = editor.getSelection();
    return editor.getModel().getOffsetAt(selection.getEndPosition());
  },
  get text() {
    return editor.getValue();
  },
  set text(v) {
    // Select all text
    const fullRange = editor.getModel().getFullModelRange();

    // Apply the text over the range
    editor.executeEdits(null, [{
      text: v,
      range: fullRange
    }]);
  }
  ,
  selectAllIfNone() {
    if (this.startSelection == this.endSelection) {
      editor.setSelection(editor.getModel().getFullModelRange());
    }
  },
};

window.utils = utils;
