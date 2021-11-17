
const Type = require("./Type");
const util = require("./../../Util");
const FDescInit = require("./V8FDescInit").FDescInit;
    
function initSandbox(runtime,generator) {
    let nopFunction = Type.vmAnalyzeCode(runtime.Sandbox, "function nopFunction(){};nopFunction;");
    Type.vmAnalyzeCode(runtime.Sandbox, "this_ = this");
    Type.vmAnalyzeCode(runtime.Sandbox, "apply_ = Function.prototype.apply");
    runtime.Sandbox.operand1 = generator;
    Type.vmAnalyzeCode(runtime.Sandbox, "generator_ = operand1");

    let Array_ = Type.vmAnalyzeCode(runtime.Sandbox, "Array");
    runtime.Sandbox.operand1 = Array_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Array = operand1;");
    runtime.addBuiltinFunction(Array_, "Array", Type.baseTypes.function);
    
    let Boolean_ = Type.vmAnalyzeCode(runtime.Sandbox, "Boolean");
    runtime.Sandbox.operand1 = Boolean_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Boolean = operand1;");
    runtime.addBuiltinFunction(Boolean_, "Boolean", Type.baseTypes.function);
    
    let Symbol_ = Type.vmAnalyzeCode(runtime.Sandbox, "Symbol");
    runtime.Sandbox.operand1 = Symbol_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Symbol = operand1;");
    runtime.addBuiltinFunction(Symbol_, "Symbol", Type.baseTypes.function);
    
    let BigInt_ = Type.vmAnalyzeCode(runtime.Sandbox, "BigInt");
    runtime.Sandbox.operand1 = BigInt_;
    Type.vmAnalyzeCode(runtime.Sandbox, "BigInt = operand1;");
    runtime.addBuiltinFunction(BigInt_, "BigInt", Type.baseTypes.function);
    
    let Number_ = Type.vmAnalyzeCode(runtime.Sandbox, "Number");
    runtime.Sandbox.operand1 = Number_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Number = operand1;");
    runtime.addBuiltinFunction(Number_, "Number", Type.baseTypes.function);
    
    let Object_ = Type.vmAnalyzeCode(runtime.Sandbox, "Object");
    runtime.Sandbox.operand1 = Object_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Object = operand1;");
    runtime.addBuiltinFunction(Object_, "Object", Type.baseTypes.function);
    
    let String_ = Type.vmAnalyzeCode(runtime.Sandbox, "String");
    runtime.Sandbox.operand1 = String_;
    Type.vmAnalyzeCode(runtime.Sandbox, "String = operand1;");
    runtime.addBuiltinFunction(String_, "String", Type.baseTypes.function);
    
    let gc_ = nopFunction;
    runtime.Sandbox.operand1 = gc_;
    Type.vmAnalyzeCode(runtime.Sandbox, "gc = operand1;");
    runtime.addBuiltinFunction(gc_, "gc", Type.baseTypes.nonconstructor);
    
    let Error_ = Type.vmAnalyzeCode(runtime.Sandbox, "Error");
    runtime.Sandbox.Error = Error_;
    
    let EvalError_ = Type.vmAnalyzeCode(runtime.Sandbox, "EvalError");
    runtime.Sandbox.EvalError = EvalError_;
    
    let RangeError_ = Type.vmAnalyzeCode(runtime.Sandbox, "RangeError");
    runtime.Sandbox.RangeError = RangeError_;
    
    let ReferenceError_ = Type.vmAnalyzeCode(runtime.Sandbox, "ReferenceError");
    runtime.Sandbox.ReferenceError = ReferenceError_;
    
    let SyntaxError_ = Type.vmAnalyzeCode(runtime.Sandbox, "SyntaxError");
    runtime.Sandbox.SyntaxError = SyntaxError_;
    
    let TypeError_ = Type.vmAnalyzeCode(runtime.Sandbox, "TypeError");
    runtime.Sandbox.TypeError = TypeError_;
    
    let URIError_ = Type.vmAnalyzeCode(runtime.Sandbox, "URIError");
    runtime.Sandbox.URIError = URIError_;
    
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
