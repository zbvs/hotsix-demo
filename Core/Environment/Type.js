const util = require("./../../Util.js")
const debug = require("../../Config").debug;
const es6 = require("./../ESTree").es6;


class Type {
    constructor(baseType) {
        this.baseType = baseType;
        this.value = null;
        this.isBuiltin = false;
        //for parameter.
        this.optional = false;
    }
};


Type.createFDesc = (scope) => {
    let fdesc = {};
    fdesc.params = [];
    fdesc.forbidden = false;
    fdesc.inited = false;
    fdesc.scope = scope;
    fdesc.nodePair = null;
    fdesc.constructable = false;
    fdesc.needThis = false;
    fdesc.isBuiltin = false;
    fdesc.useType = "";
    fdesc.name = "";
    fdesc.function = null;
    //(DEBUG_CHECK
    if (debug) {
        fdesc = util.getDebugProxy(fdesc);
    }
    //)DEBUG_CHECK
    return fdesc;
};

Type.FuncUseTypes = {
    non: "non",
    call: "call",
    template: "template",
    callback: "callback",
};

`
//null
//undefined
//any
    //primitive
        //symbol
        //string
        //number
            //int
                //plus
            //double
        //boolean
        //bigint
    //object
        //function
            //nonconstructor
            //constructor
        //array
`

Type.baseTypes = {
    root: "root",

    undefined: "undefined",
    null: "null",
    any: "any",

    primitive: "primitive",
    symbol: "symbol",
    string: "string",
    number: "number",
    int: "int",
    plus: "plus",
    double: "double",
    boolean: "boolean",
    bigint: "bigint",

    object: "object",
    function: "function",
    constructor: "constructor",
    nonconstructor: "nonconstructor",
    array: "array"
};

Type.initialTypeArray = [Type.baseTypes.array, Type.baseTypes.object, Type.baseTypes.function, Type.baseTypes.plus, Type.baseTypes.string, Type.baseTypes.double, Type.baseTypes.boolean, Type.baseTypes.bigint, Type.baseTypes.symbol];

Type.typeMap = new Map();
Type.defineTypeTree = (type, parent) => {
    let node;
    if (parent === null)
        node = {depth: 0, parent: null, baseType: type};
    else
        node = {depth: parent.depth + 1, parent: parent, baseType: type};
    Type.typeMap.set(type, node);
    return node;
};


{
    Type.treeRoot = Type.defineTypeTree(Type.baseTypes.root, null);
    Type.defineTypeTree(Type.baseTypes.undefined, Type.treeRoot);
    Type.defineTypeTree(Type.baseTypes.null, Type.treeRoot);

    let any = Type.defineTypeTree(Type.baseTypes.any, Type.treeRoot);

    let primitive = Type.defineTypeTree(Type.baseTypes.primitive, any);
    Type.defineTypeTree(Type.baseTypes.symbol, primitive);
    Type.defineTypeTree(Type.baseTypes.string, primitive);
    let number = Type.defineTypeTree(Type.baseTypes.number, primitive);
    let int = Type.defineTypeTree(Type.baseTypes.int, number);
    Type.defineTypeTree(Type.baseTypes.plus, int);

    Type.defineTypeTree(Type.baseTypes.double, number);

    Type.defineTypeTree(Type.baseTypes.boolean, primitive);
    Type.defineTypeTree(Type.baseTypes.bigint, primitive);

    let object = Type.defineTypeTree(Type.baseTypes.object, any);
    Type.defineTypeTree(Type.baseTypes.array, object);
    let func = Type.defineTypeTree(Type.baseTypes.function, object);
    Type.defineTypeTree(Type.baseTypes.constructor, func);
    Type.defineTypeTree(Type.baseTypes.nonconstructor, func);
}
;


Type.getCommonType = (basetype1, basetype2) => {

    if (basetype1 === basetype2)
        return basetype1;
    if (basetype1 === Type.baseTypes.any && basetype2 !== Type.baseTypes.undefined && basetype2 !== Type.baseTypes.null)
        return basetype1;
    if (basetype2 === Type.baseTypes.any && basetype1 !== Type.baseTypes.undefined && basetype1 !== Type.baseTypes.null)
        return basetype2;

    let node1 = Type.typeMap.get(basetype1);
    let node2 = Type.typeMap.get(basetype2);

    if (node1.depth < node2.depth) {
        while (node1.depth < node2.depth) {
            node2 = node2.parent;
        }
        while (node1 !== node2) {
            node1 = node1.parent;
            node2 = node2.parent;
        }
        return node1.baseType;
    } else {
        while (node1.depth > node2.depth) {
            node1 = node1.parent;
        }
        while (node1 !== node2) {
            node1 = node1.parent;
            node2 = node2.parent;
        }
        return node1.baseType;
    }
    util.unreachable();

};


Type.isSubsumeType = (Is, Of) => {
    if (Is === Of)
        return true;
    let commonType = Type.getCommonType(Is, Of);
    return commonType === Is;
};

Type.getDetailedTypeOf = (target) => {
    let baseType = typeof target;
    if (Type.isSubsumeType(Type.baseTypes.object, baseType)) {
        if (target === null)
            return Type.baseTypes.null;
        //We need to ensure it is not a property descriptor by checking Type does not have "configurable" property
        else if (Type.hasOwnProperty(target, Type.specialKeys.keyTypeRef) && !target[Type.specialKeys.keyTypeRef].hasOwnProperty("configurable")) {
            if (debug && target[Type.specialKeys.keyHostCorruptionCheck])
                util.unreachable();
            return target[Type.specialKeys.keyTypeRef].baseType;
        } else {
            if (Array.isArray(target))
                return Type.baseTypes.array;
            else
                return baseType;
        }
    } else {
        if (baseType === Type.baseTypes.number) {
            if ((target % 1 === 0)) {
                baseType = target >= 0 ? Type.baseTypes.plus : Type.baseTypes.int;
            } else {
                baseType = Type.baseTypes.double
            }
        }
        return baseType;
    }

};

Type.createTypeWith = (target) => {
    let baseType = typeof target;
    let type;

    if (Type.isSubsumeType(Type.baseTypes.object, baseType)) {
        if (target === null) {
            baseType = Type.baseTypes.null;
            //(TODO we can use special value . NULL
            type = new Type(baseType);
            type.value = target;
        }
        //We need to ensure it is not a property descriptor by checking Type does not have "configurable" property
        else if (Type.hasOwnProperty(target, Type.specialKeys.keyTypeRef) && !target[Type.specialKeys.keyTypeRef].hasOwnProperty("configurable")) {
            if (debug && target[Type.specialKeys.keyHostCorruptionCheck])
                throw new util.DebugError("Host was corrupted");
            type = target[Type.specialKeys.keyTypeRef];
        } else {
            if (debug && target[Type.specialKeys.keyHostCorruptionCheck])
                throw new util.DebugError("Host was corrupted");
            if (Array.isArray(target)) {
                type = new Type(Type.baseTypes.array);
            } else {
                type = new Type(baseType);
            }

            type.value = target;
            if (Object.isExtensible(target)) {
                Object.defineProperty(target, Type.specialKeys.keyTypeRef, {
                    enumerable: false,
                    writable: false,
                    configurable: false,
                    value: type
                });
            }
        }
    } else {
        if (baseType === Type.baseTypes.number) {
            if ((target % 1 === 0)) {
                baseType = target >= 0 ? Type.baseTypes.plus : Type.baseTypes.int;
            } else {
                baseType = Type.baseTypes.double
            }
        }
        type = new Type(baseType);
        type.value = target;
    }
    if (debug && !type)
        throw new util.DebugError("Invalid Type Created");
    //(DEBUG_CHECK
    if (debug) {
        type = util.getDebugProxy(type);
    }
    //)DEBUG_CHECK
    return type;
};


Type.getCompatibleUnaryOperators = (baseType1) => {

    let operators;
    switch (baseType1) {
        case Type.baseTypes.bigint: {
            operators = es6.CommonUnaryOperator.slice();
            operators = operators.concat(es6.EffectMathUnaryOperator);
            break;
        }
        case Type.baseTypes.symbol: {
            operators = es6.CommonUnaryOperator.slice();
            break;
        }
        default: {
            operators = es6.UnaryOperator.slice();
            break;
        }
    }
    return operators;
};

Type.unaryResultType = (operator, type1) => {
    //let UnaryOperator = ["-" , "+" , "!" , "~" , "typeof" , "void" , "delete"];

    let value1 = type1.value;
    let resultValue;
    switch (operator) {
        case "-":
            resultValue = -value1;
            break;
        case "+":
            resultValue = +value1;
            break;
        case "~":
            resultValue = ~value1;
            break;
        case "!":
            resultValue = !value1;
            break;
        case "typeof":
            resultValue = typeof value1;
            break;
        case "void":
            resultValue = undefined;
            break;
        case "delete":
            util.unreachable();
            break;
        default:
            util.unreachable();
    }
    let type = Type.createTypeWith(resultValue);

    if (debug && !Type.isSubsumeType(Type.baseTypes.primitive, type.baseType)) {
        util.unreachable();
    }
    return type;
};


Type.updateResultType = (operator, type1) => {
    //let UpdateOperator = ["++" , "--"];
    let value1 = type1.value;
    let resultValue;
    switch (operator) {
        case "++":
            resultValue = value1 + 1;
            break;
        case "--":
            resultValue = value1 - 1;
            break;
        default:
            util.unreachable();
    }
    let type = Type.createTypeWith(resultValue);

    if (debug && !Type.isSubsumeType(Type.baseTypes.primitive, type.baseType)) {
        util.unreachable();
    }
    return type;
};


Type.getCompatibleBinaryOperators = (baseType1, baseType2) => {
    let operators;
    switch (baseType1) {
        case Type.baseTypes.bigint: {
            if (baseType2 === Type.baseTypes.bigint) {
                operators = es6.BigIntBinaryOperator.slice();
            } else if (baseType2 === Type.baseTypes.symbol) {
                operators = es6.EqualityOperator.slice();
            } else {
                operators = es6.ComparisonOperator.slice();
                if (baseType2 === Type.baseTypes.string) {
                    operators.push("+");
                }
            }
            break;
        }
        case Type.baseTypes.symbol: {
            operators = es6.EqualityOperator.slice();
            break;
        }
        case Type.baseTypes.string: {
            if (baseType2 === Type.baseTypes.bigint) {
                operators = es6.EqualityOperator.slice();
                operators.push("+");
            } else if (baseType2 === Type.baseTypes.symbol) {
                operators = es6.EqualityOperator.slice();
            } else {
                operators = es6.BinaryOperator.slice();
            }
            break;
        }
        default: {
            if (baseType2 === Type.baseTypes.bigint) {
                operators = es6.ComparisonOperator.slice();
            } else if (baseType2 === Type.baseTypes.symbol) {
                operators = es6.EqualityOperator.slice();
            } else {
                operators = es6.BinaryOperator.slice();
            }
            break;
        }
    }

    if (Type.isSubsumeType(Type.baseTypes.object, baseType2)) {
        operators.push("in");
        if (Type.isSubsumeType(Type.baseTypes.function, baseType2)) {
            operators.push("instanceof");
        }
    }
    return operators;
};


Type.binaryResultType = (operator, type1, type2) => {
    //let AssignmentOperator = [ "=" , "+=" , "-=" , "*=" , "/=" , "%=", "<<=" , ">>=" , ">>>=", "|=" , "^=" , "&=" ];

    let value1 = type1.value;
    let value2 = type2.value;

    let resultValue;
    switch (operator) {
        case "==":
            resultValue = value1 == value2;
            break;
        case "!=":
            resultValue = value1 != value2;
            break;
        case "===":
            resultValue = value1 === value2;
            break;
        case "!==":
            resultValue = value1 !== value2;
            break;
        case "<":
            resultValue = value1 < value2;
            break;
        case "<=":
            resultValue = value1 <= value2;
            break;
        case ">":
            resultValue = value1 > value2;
            break;
        case ">=":
            resultValue = value1 >= value2;
            break;
        case "<<":
            resultValue = value1 << value2;
            break;
        case ">>":
            resultValue = value1 >> value2;
            break;
        case ">>>":
            resultValue = value1 >>> value2;
            break;
        case "|":
            resultValue = value1 | value2;
            break;
        case "^":
            resultValue = value1 ^ value2;
            break;
        case "&":
            resultValue = value1 & value2;
            break;
        case "+":
            resultValue = value1 + value2;
            break;
        case "-":
            resultValue = value1 - value2;
            break;
        case "*":
            resultValue = value1 * value2;
            break;
        case "/":
            resultValue = value1 / value2;
            break;
        case "%":
            resultValue = value1 % value2;
            break;
        case "in":
            resultValue = value1 in value2;
            break;
        case "instanceof":
            resultValue = value1 instanceof value2;
            break;
        default:
            util.unreachable();
    }

    let type = Type.createTypeWith(resultValue);

    if (debug && !Type.isSubsumeType(Type.baseTypes.primitive, type.baseType)) {
        util.unreachable();
    }
    return type;
};


Type.assignmentResultType = (operator, type1, type2) => {
    //let AssignmentOperator = [ "=" , "+=" , "-=" , "*=" , "/=" , "%=", "<<=" , ">>=" , ">>>=", "|=" , "^=" , "&=" ];
    let value1 = type1.value;
    let value2 = type2.value;
    let resultValue;
    switch (operator) {
        case "=":
            resultValue = value2;
            break;
        case "<<=":
            resultValue = value1 << value2;
            break;
        case ">>=":
            resultValue = value1 >> value2;
            break;
        case ">>>=":
            resultValue = value1 >>> value2;
            break;
        case "|=":
            resultValue = value1 | value2;
            break;
        case "^=":
            resultValue = value1 ^ value2;
            break;
        case "&=":
            resultValue = value1 & value2;
            break;
        case "+=":
            resultValue = value1 + value2;
            break;
        case "-=":
            resultValue = value1 - value2;
            break;
        case "*=":
            resultValue = value1 * value2;
            break;
        case "/=":
            resultValue = value1 / value2;
            break;
        case "%=":
            resultValue = value1 % value2;
            break;
        default:
            util.unreachable();
    }

    let type = Type.createTypeWith(resultValue);
    if (debug && operator !== "=" && !Type.isSubsumeType(Type.baseTypes.primitive, type.baseType)) {
        util.unreachable();
    }
    return type;
};


Type.logicalResultType = (operator, type1, type2) => {
    let value1 = type1.value;
    let value2 = type2.value;
    //let LogicalOperator = [ "||" , "&&" ];
    let resultValue;
    if (operator === "||") {
        if (value1)
            return type1;
        else
            return type2;
    } else if (operator === "&&") {
        if (value1)
            return type2;
        else
            return type1;
    } else {
        util.unreachable();
    }
};


Type.checkIsEffective = (type) => {
    let value = type.value;
    //(TODO  .. currently we use too wide range for effective check
    if (Type.isSubsumeType(Type.baseTypes.object, type.baseType))
        return true;
    return false;
};

const vm = require('vm');
const escodegen = require("../../lib/escodegen-bigint");


var HasOwnProperty = Object.prototype.hasOwnProperty;

Type.hasOwnProperty = (target, key) => {
    return HasOwnProperty.call(target, key);
}

Type.vmAnalyzeAst = (sandbox, ast) => {
    let code = escodegen.generate(ast);

    if (debug) util.lprint("\nValue.vmAnalyzeAst")
    if (debug) util.lprint(code)
    return vm.runInNewContext(code, sandbox);
};

Type.vmAnalyzeCode = (sandbox, code) => {
    return vm.runInNewContext(code, sandbox);
};

Type.vmGenCode = (ast) => {
    return escodegen.generate(ast);
};


const keyArguments = "arguments";
const keyCaller = "callee";
const keyCallee = "caller";
const keyName = "name";


const keyApply = "__apply__";
const keyTypeRef = "__keyTypeRef__";
const keyIsBuiltin = "__isBuiltin__";
const keyIsCustom = "__keyIsCustom__";
const keyFdesc = "__keyFdesc__";
const keyRecordId = "__recordId__";
const keyHostCorruptionCheck = "__hostCheck__";


Type.specialKeys = {
    keyApply: keyApply,
    keyTypeRef: keyTypeRef,
    keyIsBuiltin: keyIsBuiltin,
    keyIsCustom: keyIsCustom,
    keyFdesc: keyFdesc,
    keyHostCorruptionCheck: keyHostCorruptionCheck,
    keyArguments: keyArguments,//to prevent runtime error
    keyCaller: keyCaller,
    keyCallee: keyCallee,
    keyName: keyName,
};

if (debug) {
    Type.specialKeysArray = [keyIsBuiltin, keyIsCustom, keyTypeRef, keyFdesc, keyRecordId, keyArguments, keyCaller, keyCallee, keyApply, keyName];
    Type.specialKeys["keyRecordId"] = keyRecordId;
} else
    Type.specialKeysArray = [keyIsBuiltin, keyIsCustom, keyTypeRef, keyFdesc, keyArguments, keyCaller, keyCallee, keyApply, keyName];

Type.getKeys = (object) => {
    let keys = Object.getOwnPropertyNames(object);
    keys = keys.filter(Type.getKeys.filter);
    return keys;
};

Type.getKeys.filter = (el) => {
    return Type.specialKeysArray.indexOf(el) < 0;
};

const functionTrapCodeFront = `(function `;
const functionTrapCodeTail = `(){
        return generator_.TrapHandler.call(this,arguments);
    })`;

Type.functionTrapCodeFront = functionTrapCodeFront;
Type.functionTrapCodeTail = functionTrapCodeTail;

const functionTrapCode = `(function (){
        return generator_.TrapHandler.call(this,arguments);
    })`;

const esprima = require("esprima");
const functionTrapAst = esprima.parse(functionTrapCode).body[0].expression;
Type.functionTrapCode = functionTrapCode;
Type.functionTrapAst = functionTrapAst;

module.exports = Type;


