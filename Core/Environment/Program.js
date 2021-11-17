const es6 = require("../ESTree.js").es6
const util = require("../../Util.js");
const env = require("./Environment.js");
const debug = require("./../../Config").debug;

function createProgram(generator){
    let program = {};
    program.ast = es6.createNode("Program", 1);
    program.runtime = env.createRuntime(program);
    program.scope = program.runtime.createScope();
    return program;
}


module.exports = {
    createProgram : createProgram
}

