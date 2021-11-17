const util = require("./../../Util");
const debug = require("./../../Config").debug;

class Variable {
    constructor(varName, isArgument = false){
        if(debug && (typeof varName) !== "object"){
            util.unreachable();
        }

        this.useNodes = [];
        this.Type = null;
        this.varName = varName;
        this.defNode = null;
        this.isBuiltin = false;
        this.useCount = 0;
        this.isArgument = isArgument;

    }
}

Variable.createVarName = (boxedName, originName) => {
    return {boxed:boxedName,origin:originName};
};

module.exports = Variable;

/*
Variable can share type

var a = {}
var b = a; -> b.Type = a.Type;
a.prop = 1;  -> a.Type.childs[prop] = 1;
s

 */

