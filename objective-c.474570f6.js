parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"iUJh":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.language=exports.conf=void 0;var e={comments:{lineComment:"//",blockComment:["/*","*/"]},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}]};exports.conf=e;var o={defaultToken:"",tokenPostfix:".objective-c",keywords:["#import","#include","#define","#else","#endif","#if","#ifdef","#ifndef","#ident","#undef","@class","@defs","@dynamic","@encode","@end","@implementation","@interface","@package","@private","@protected","@property","@protocol","@public","@selector","@synthesize","__declspec","assign","auto","BOOL","break","bycopy","byref","case","char","Class","const","copy","continue","default","do","double","else","enum","extern","FALSE","false","float","for","goto","if","in","int","id","inout","IMP","long","nil","nonatomic","NULL","oneway","out","private","public","protected","readwrite","readonly","register","return","SEL","self","short","signed","sizeof","static","struct","super","switch","typedef","TRUE","true","union","unsigned","volatile","void","while"],decpart:/\d(_?\d)*/,decimal:/0|@decpart/,tokenizer:{root:[{include:"@comments"},{include:"@whitespace"},{include:"@numbers"},{include:"@strings"},[/[,:;]/,"delimiter"],[/[{}\[\]()<>]/,"@brackets"],[/[a-zA-Z@#]\w*/,{cases:{"@keywords":"keyword","@default":"identifier"}}],[/[<>=\\+\\-\\*\\/\\^\\|\\~,]|and\\b|or\\b|not\\b]/,"operator"]],whitespace:[[/\s+/,"white"]],comments:[["\\/\\*","comment","@comment"],["\\/\\/+.*","comment"]],comment:[["\\*\\/","comment","@pop"],[".","comment"]],numbers:[[/0[xX][0-9a-fA-F]*(_?[0-9a-fA-F])*/,"number.hex"],[/@decimal((\.@decpart)?([eE][\-+]?@decpart)?)[fF]*/,{cases:{"(\\d)*":"number",$0:"number.float"}}]],strings:[[/'$/,"string.escape","@popall"],[/'/,"string.escape","@stringBody"],[/"$/,"string.escape","@popall"],[/"/,"string.escape","@dblStringBody"]],stringBody:[[/[^\\']+$/,"string","@popall"],[/[^\\']+/,"string"],[/\\./,"string"],[/'/,"string.escape","@popall"],[/\\$/,"string"]],dblStringBody:[[/[^\\"]+$/,"string","@popall"],[/[^\\"]+/,"string"],[/\\./,"string"],[/"/,"string.escape","@popall"],[/\\$/,"string"]]}};exports.language=o;
},{}]},{},["iUJh"], null)