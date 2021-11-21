//require("./V8EnvInitGen");
const Type = require("./Type");
const util = require("./../../Util");


function initSandbox(runtime, generator) {

    Type.vmAnalyzeCode(runtime.Sandbox, "this_ = this");
    Type.vmAnalyzeCode(runtime.Sandbox, "apply_ = Function.prototype.apply");
    runtime.Sandbox.operand1 = generator;
    Type.vmAnalyzeCode(runtime.Sandbox, "generator_ = operand1");

    ////////////////////////////////////////////////////////////

    let Function_ = Type.vmAnalyzeCode(runtime.Sandbox, "Function");
    runtime.Sandbox.operand1 = Function_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Function = operand1;");
    runtime.addBuiltinFunction(Function_, "Function", Type.baseTypes.constructor);


    ////////////////////////////////////////////////////////////
    let Object_ = Type.vmAnalyzeCode(runtime.Sandbox, "Object");
    runtime.Sandbox.operand1 = Object_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Object = operand1;");
    runtime.addBuiltinFunction(Object_, "Object", Type.baseTypes.constructor);

    ////////////////////////////////////////////////////////////
    let Array_ = Type.vmAnalyzeCode(runtime.Sandbox, "Array");
    runtime.Sandbox.operand1 = Array_;
    Type.vmAnalyzeCode(runtime.Sandbox, "Array = operand1;");
    runtime.addBuiltinFunction(Array_, "Array", Type.baseTypes.constructor);

    const FDescInit = require("./V8FDescInit").FDescInit;
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
    initSandbox: initSandbox,
}




























