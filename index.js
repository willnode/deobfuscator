import * as monaco from 'monaco-editor';
import * as beautify from 'js-beautify';

console.log(process.env.NODE_ENV);

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css') {
			return './css.worker.bundle.js';
		}
		if (label === 'html') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
}

const editor = monaco.editor.create(document.getElementById('container'), {
	value: sessionStorage['decoder-text'] || [
		'function x() {',
		'\tconsole.log("Hello world!");',
		'}'
	].join('\n'),
	language: 'javascript',
	wordWrap: "on",
	automaticLayout: true,
});

editor.model.onDidChangeContent(() => {
	sessionStorage['decoder-text'] = utils.text;
});

const utils = {
	get selectedText() {
		return editor.getModel().getValueInRange(editor.getSelection());
	},
	set selectedText(text) {
		var selection = editor.getSelection();
		var range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
		var id = { major: 1, minor: 1 };
		var op = {identifier: id, range: range, text: text, forceMoveMarkers: true};
		editor.executeEdits("my-source", [op]);
	},
	get startSelection() {
		var selection = editor.getSelection();
		return editor.getModel().getOffsetAt(selection.getStartPosition())
	},
	get endSelection() {
		var selection = editor.getSelection();
		return editor.getModel().getOffsetAt(selection.getEndPosition())
	},
	get text() {
		return editor.getValue();
	},
	set text(v) {
		editor.setValue(v);
	},
	selectAllIfNone () {
		if(this.startSelection == this.endSelection) {
			editor.setSelection(editor.getModel().getFullModelRange())
		}
	}
}
window.utils = utils;

window.evalStr = function() {
	utils.selectedText = JSON.stringify(eval("(" + utils.selectedText + ")"));
}

window.evalSelectiveStr = function() {
	utils.selectAllIfNone();
	var replaced = utils.selectedText.replace(/"(\\"|[^"])*?"/g, function(m) {
		return JSON.stringify(eval(m))
	});
	utils.selectedText = replaced
}

window.expandBracket = function() {
	editor.getAction('editor.action.selectToBracket').run()
}

window.setReplaceVariable = function () {
	var txt = utils.selectedText;
	var valname = /([_\w\d]+)\s*=\s*$/.exec(utils.text.substring(0, utils.startSelection))[1]
	var obj = eval(txt)
	if (Array.isArray(obj)) {
		var replaced = utils.text.replace(new RegExp(valname + "\\[(\\d+)\\]", "g"), function(_, p1) {
			return JSON.stringify(obj[p1])
		});
		utils.text = replaced;
	} else {
		var replaced = utils.text.replace(new RegExp(valname, "g"), function(_, p1) {
			return JSON.stringify(obj)
		});
		utils.text = replaced;
	}
}

window.beautify = function() {
	utils.text = beautify(utils.text, {indent_size: 2});
}

window.normalizeAccess = function() {
	utils.selectAllIfNone();
	utils.selectedText = utils.selectedText.replace(/\["([\w_][\w\d_]*?)"\]/g, ".$1");
}