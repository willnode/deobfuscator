import * as monaco from "monaco-editor";
import beautify from "js-beautify";

console.log(process.env.NODE_ENV);

/* Editor Initialization */

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return "./ts.worker.js";
  },
};

const editor = monaco.editor.create(document.getElementById("container"), {
  value:
    sessionStorage["decoder-text"] ||
    ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
  language: "javascript",
  wordWrap: "on",
  automaticLayout: true,
});

editor.getModel().onDidChangeContent(() => {
  sessionStorage["decoder-text"] = utils.text;
});

function colName(n) {
  var ordA = "a".charCodeAt(0);
  var ordZ = "z".charCodeAt(0);
  var len = ordZ - ordA + 1;

  var s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
}

const utils = {
  get selectedText() {
    return editor.getModel().getValueInRange(editor.getSelection());
  },
  set selectedText(text) {
    var selection = editor.getSelection();
    var range = new monaco.Range(
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
    editor.setValue(v);
  },
  selectAllIfNone() {
    if (this.startSelection == this.endSelection) {
      editor.setSelection(editor.getModel().getFullModelRange());
    }
  },
};
window.utils = utils;

/* Evaluation Tools */

window.stackEval = [];

window.evalStr = function () {
  if (window.stackEval.length > 0) {
    utils.selectedText = JSON.stringify(
      eval(`
			(function(){
				${stackEval.slice(-1)[0]}
				return ${utils.selectedText};
			})();
		`)
    );
  } else {
    utils.selectedText = JSON.stringify(eval("(" + utils.selectedText + ")"));
  }
};

window.evalBareStr = function () {
  if (window.stackEval.length > 0) {
    utils.selectedText = String(
      eval(`
			(function(){
				${stackEval.slice(-1)[0]}
				return ${utils.selectedText};
			})();
		`)
    );
  } else {
    utils.selectedText = String(eval("(" + utils.selectedText + ")"));
  }
}

window.evalPush = function () {
  if (utils.startSelection != utils.endSelection) {
    window.stackEval.push(
      (window.stackEval.slice(-1)[0] || "") + utils.selectedText + "\n"
    );
    console.log("stackEval pushed, current evaluation:");
    console.log(window.stackEval.slice(-1)[0]);
  } else {
    console.log("Nothing selected");
  }
};
window.evalPop = function () {
  window.stackEval.pop();
  console.log("stackEval popped, current evaluation:");
  console.log(stackEval.slice(-1)[0]);
};

window.evalAuto = function () {
  utils.selectAllIfNone();
  var r = /(?:^|;)\s*(?:var|const|let)\s+(\w+)/gm,
    w,
    v = [],
    text = utils.selectedText;
  while ((w = r.exec(window.stackEval.slice(-1)[0])) !== null) v.push(w[1]);
  console.log("Captured variables:");
  console.log(v);
  v.forEach((t) => {
    text = text.replace(
      new RegExp(t + "(\\[.+?\\]|\\(.+?\\)|\\b)", "g"),
      function (token) {
        try {
          var result = eval(`
			(function(){
				${stackEval.slice(-1)[0]}
				return ${token};
			})();
		`);
          if (typeof result == "string" || typeof result == "number") {
            return JSON.stringify(result);
          } else {
            return token;
          }
        } catch (error) {
          return token;
        }
      }
    );
  });
  utils.selectedText = text;
};

/* Formatting Tools */

window.beautify = function () {
  utils.text = beautify(utils.text, { indent_size: 2 });
};

window.simplifyString = function () {
  utils.selectAllIfNone();
  var replaced = utils.selectedText
    .replace(/"(\\"|[^"])*?"/g, function (m) {
      return JSON.stringify(eval(m));
    })
    .replace(/'(\\"|[^'])*?'/g, function (m) {
      return JSON.stringify(eval(m));
    });
  utils.selectedText = replaced;
};

window.simplifyNumber = function () {
  utils.selectAllIfNone();
  var replaced = utils.selectedText.replace(
    /\b0x[a-fA-F0-9]+\b/g,
    function (m) {
      return JSON.stringify(eval(m));
    }
  );
  utils.selectedText = replaced;
};

window.simplifyNumberExp = function () {
  utils.selectAllIfNone();
  var replaced = utils.selectedText.replace(
    /(\b|-)[-+* \d\.]+\d\b/g,
    function (m) {
      try {
        var r = eval(m);
        return typeof r == "number" ? JSON.stringify(r) : m;
      } catch (error) {
        return m;
      }
    }
  );
  utils.selectedText = replaced;
};


window.simplifyStringExp = function () {
  utils.selectAllIfNone();
  var replaced = utils.selectedText.replace(
    /"[\w" \+]+"/g,
    function (m) {
      try {
        var r = eval(m);
        return typeof r == "string" ? JSON.stringify(r) : m;
      } catch (error) {
        return m;
      }
    }
  );
  utils.selectedText = replaced;
};

window.simplifyAccess = function () {
  utils.selectAllIfNone();
  utils.selectedText = utils.selectedText
    .replace(/\["([\w_][\w\d_]*?)"\]/g, ".$1")
    .replace(/\['([\w_][\w\d_]*?)'\]/g, ".$1");
};

window.simplifyVar = function () {
  utils.selectAllIfNone();
  // This function dissasemble var chain. Can't figure save way to do it yet.
  console.log("Coming Soon!");
};

window.simplifyHex = function () {
  utils.selectAllIfNone();
  var letters = {};
  var letc = 0;
  var s = utils.selectedText;
  var replaced = s.replace(/\b_0x[a-fA-F0-9]+\b/g, function (m) {
    if (letters[m]) return letters[m];
    else {
      var x;
      while ((x = colName(letc++)))
        if (!s.match(new RegExp("\\b" + x + "\\b", "i")))
          if (
            !["do", "if", "in", "for", "let", "new", "var", "try"].includes(x)
          )
            break;

      letters[m] = x;
      return x;
    }
  });
  utils.selectedText = replaced;
};

window.gotoRepo = function () {
  window.open("https://github.com/willnode/deobfuscator", "_blank");
};
