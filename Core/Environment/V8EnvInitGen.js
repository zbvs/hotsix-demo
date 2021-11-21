const fs = require("fs");
const config = require("./../../Config");
let V8EnvInitPath = "./Core/Environment/V8EnvInit.js";

var Constructors = [
    'ArrayBuffer', 'BigInt64Array',
    'BigUint64Array', 'DataView',
    'Float32Array', 'Float64Array',
    'Int16Array', 'Int32Array',
    'Int8Array', 'Map',
    'Promise', 'Proxy',
    'Set', 'SharedArrayBuffer',
    'Uint16Array', 'Uint32Array',
    'Uint8Array', 'Uint8ClampedArray',
    'WeakMap', 'WeakSet'
];

/*
var Functions = [
    'Array',       'Boolean',
    'Date',        'Function',
    'Number',      'Object',
    'RegExp',      'String',
    'Error',       'EvalError',
    'RangeError',  'ReferenceError',
    'SyntaxError', 'TypeError',
    'URIError'
];
*/

var Functions = [
    'Array', 'Boolean',
    'Symbol', 'BigInt',
    'Number', 'Object',
    'String',
];

var Errors = [
    'Error', 'EvalError',
    'RangeError', 'ReferenceError',
    'SyntaxError', 'TypeError',
    'URIError'
];

var NopFunctions = [
    'gc'
];
var NonConstructors = [];

var BuiltinOthers = ["JSON", "Math", "Symbol"];
var BuiltinFunctions = ["escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "unescape"];


var header = `
const Type = require("./Type");
const util = require("./../../Util");
const FDescInit = require("./V8FDescInit").FDescInit;
    
function initSandbox(runtime,generator) {
    let nopFunction = Type.vmAnalyzeCode(runtime.Sandbox, "function nopFunction(){};nopFunction;");
    Type.vmAnalyzeCode(runtime.Sandbox, "this_ = this");
    Type.vmAnalyzeCode(runtime.Sandbox, "apply_ = Function.prototype.apply");
    runtime.Sandbox.operand1 = generator;
    Type.vmAnalyzeCode(runtime.Sandbox, "generator_ = operand1");
`;


var body = '';
for (let name of Functions) {
    body += `
    let ${name + "_"} = Type.vmAnalyzeCode(runtime.Sandbox, "${name}");
    runtime.Sandbox.operand1 = ${name + "_"};
    Type.vmAnalyzeCode(runtime.Sandbox, "${name} = operand1;");
    runtime.addBuiltinFunction(${name + "_"}, "${name}", Type.baseTypes.function);
    `
}


for (let name of NopFunctions) {
    body += `
    let ${name + "_"} = nopFunction;
    runtime.Sandbox.operand1 = ${name + "_"};
    Type.vmAnalyzeCode(runtime.Sandbox, "${name} = operand1;");
    runtime.addBuiltinFunction(${name + "_"}, "${name}", Type.baseTypes.nonconstructor);
    `
}

for (let name of NonConstructors) {
    body += `
    let ${name + "_"} = Type.vmAnalyzeCode(runtime.Sandbox, "${name}");
    runtime.Sandbox.operand1 = ${name + "_"};
    Type.vmAnalyzeCode(runtime.Sandbox, "${name} = operand1;");
    runtime.addBuiltinFunction(${name + "_"}, "${name}", Type.baseTypes.nonconstructor);
    `
}

if (config.useConstructors === true) {
    for (let name of Constructors) {
        body += `
    let ${name + "_"} = Type.vmAnalyzeCode(runtime.Sandbox, "${name}");
    runtime.Sandbox.operand1 = ${name + "_"};
    Type.vmAnalyzeCode(runtime.Sandbox, "${name} = operand1;");
    runtime.addBuiltinFunction(${name + "_"}, "${name}", Type.baseTypes.constructor);
    `
    }
}


for (let name of Errors) {
    body += `
    let ${name + "_"} = Type.vmAnalyzeCode(runtime.Sandbox, "${name}");
    runtime.Sandbox.${name} = ${name + "_"};
    `
}


var footer = `
    FDescInit(runtime);
}
/*
function EnvInit(){
    runtime.addBuiltinFunction("Object", {min: 0, max: 1, argv: [{"k": Value.baseTypes.any, "o": 1, "u": 0}]});
    runtime.addBuiltinObject("Object.prototype");

    runtime.addBuiltinFunction("Array", {min: 0, max: Infinity, constructor:true, argv: [{"k": Value.baseTypes.any, "o": 1, "u": 1}]});
    runtime.addBuiltinObject("Array.prototype");

    runtime.addBuiltinFunction("Function", {min: 1, max: Infinity, constructor:true, argv: [{"k": Value.baseTypes.string, "o": 1, "u": 1}, {"k": Value.baseTypes.string, "o": 1, "u": 0}]});
    runtime.addBuiltinObject("Function.prototype");
}
*/


module.exports = {
    initSandbox:initSandbox,
}
`;


var result = header + body + footer;
fs.writeFileSync(V8EnvInitPath, result);
