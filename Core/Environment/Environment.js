//GEN
require("./V8EnvInitGen");
//const EnvInit = require("./EnvInit.js")
const V8EnvInit = require("./V8EnvInit.js");
const es6 = require("./../ESTree").es6;
const util = require("./../../Util.js");
const Variable = require("./Variable");
const Type = require("./Type");
const Recorder = require("./../../Recorder");
const fs = require("fs");
const config = require("./../../Config");
const debug = config.debug;



class Scope {
    constructor(parent=null, isFunction = true){
        this.vars = [];
        this.parent = parent;
        this.isFunction = isFunction;
    }
    dump(){
        util.lprint("Scope Dump");
        for(let i in this.vars){
            util.dprint(this.vars[i]);
            util.dprint(this.vars[i].Type);
        }
    }
}


class Runtime {
    constructor(program, environment){
        this.varNumber = 0;
        this.currentScope = null;
        this.globalScope = this.createScope(null);
        this.program = program;
        this.scopeStack =  [];
        this.env = environment;
        //(TODO is it safe?
        this.builtinObjectMap = new Map();
        this.callingFunctions = [];
        this.fdescMap = new Map();
        this.Sandbox = null;
        this.Recorder = Recorder;
        this.functionCreator = null;
        this.functionNumber = 0;
        Recorder.runtime = this;
    }

    logRecord(nodeStack){
        //(TODO need more efficient way
        this.Recorder.CodeRecorder.backupCode(nodeStack);
        this.renewRootCode();
    }
    insertCalling(name){
        this.callingFunctions.push(name);
    }
    isInCalling(name){
        let index = this.callingFunctions.indexOf(name);
        return index > -1;
    }
    removeCalling(name){
        let index = this.callingFunctions.indexOf(name);
        if (index > -1)
            this.callingFunctions.splice(index, 1);
        else
            util.unreachable();

    }

    createScope(parent=null, isFunction = true){
        let scope = new Scope(parent, isFunction);
        //(DEBUG_CHECK
        if(debug) {
            scope = util.getDebugProxy(scope);
        }
        //)DEBUG_CHECK
        return scope;
    }


    pushScope(scope){
        this.scopeStack.push(this.currentScope);
        this.currentScope = scope;
        return this.scopeStack.length;
    }

    popScope(){
        if(debug && this.scopeStack.length == 0){
            util.unreachable();
        }
        this.currentScope = this.scopeStack.pop();
        return this.scopeStack.length;
    }


    addBuiltinFunction(object, name, baseType){
        let cur_scope = this.globalScope;
        let varName = environment.Variable.createVarName(name, name)
        let variable = this.createBuiltinVariable(varName);

        Object.defineProperty(object, Type.specialKeys.keyIsBuiltin, {
            enumerable: false,
            writable: false,
            configurable: false,
            value: true
        });

        let funcValue;
        funcValue = this.createBuiltinType(baseType, object);


        variable.Type = funcValue;
        this.builtinObjectMap.set(name, variable.Type.value);
        cur_scope.vars.push(variable);
    }

    addFDesc(name,desc){
        let arr = desc.argv;
        let fdesc = Type.createFDesc(null);
        fdesc.forbidden = desc.forbidden;
        fdesc.needThis = desc.needThis;
        if(fdesc.needThis)
            fdesc.useType = Type.FuncUseTypes.call;
        fdesc.inited = true;
        fdesc.isBuiltin = true;
        let type;

        for(let info of arr){
            switch( info.k ){
                case "Argument":
                case "Array":{
                    type = new Type(Type.baseTypes.array);
                    break;
                }
                case "Function":{
                    type = new Type(Type.baseTypes.function);
                    break;
                }
                case "prototype":
                case "Object":
                case "Function|Array":
                case "Anything":
                case "Identifier":
                case "options":{
                    type = new Type(Type.baseTypes.object);
                    break;
                }
                case "Plus": {
                    type = new Type(Type.baseTypes.plus);
                    break;
                }
                case "Integer": {
                    type = new Type(Type.baseTypes.int);
                    break;
                }
                case "Number": {
                    type = new Type(Type.baseTypes.number);
                    break;
                }
                case "String": {
                    type = new Type(Type.baseTypes.string);
                    break;
                }
                case "Boolean":{
                    type = new Type(Type.baseTypes.boolean);
                    break;
                }
                case "handler":
                case "Error":
                case "propertiesObject":
                case "Array|TypedArray":
                case "Array|ArrayBuffer":
                case "ArrayBuffer":
                case "TypedArray":
                case "String|RegExp":
                case "RegExp":
                case "flags":
                case "iterable":
                case "Code":
                case "locales":{
                    type = new Type(Type.baseTypes.any);
                    fdesc.forbidden = true;
                    break;
                }
                default:{
                    util.unreachable();
                }
            }
            if(info.o)
                type.optional = true;
            fdesc.params.push(type);
        }
        this.Sandbox.operand1 = fdesc;
        let code = `${name}`;
        let funcObj = Type.vmAnalyzeCode(this.Sandbox,code);

        if(!Type.hasOwnProperty(funcObj, Type.specialKeys.keyFdesc)) {
            Object.defineProperty(funcObj, Type.specialKeys.keyFdesc, {
                enumerable: false,
                writable: false,
                configurable: false,
                value: fdesc
            });
            Object.defineProperty(funcObj, Type.specialKeys.keyApply, {
                enumerable: false,
                writable: false,
                configurable: false,
                value: this.Sandbox.apply_
            });
        }
    }

    getVariable(cur_scope, requireType, noArg = false, variableFrist=false, strict=false, noForbidden=false, fUseType = "", noNeedThis = false){
        let foundVar;
        let any_var;
        let varArray = cur_scope.vars;
        if(varArray.length === 0) {
            if(cur_scope.parent)
                return this.getVariable(cur_scope.parent, requireType, true, variableFrist, strict, noForbidden, noNeedThis);
            return null;
        }
        let compatible_var;

        //RANDOM ITERATE START
        //INIT
        let length = varArray.length;
        let start = 0;
        if(length > 10)
            start = (length - 10);
        let end = util.randRange(start, length);
        let current = end;

        while (true) {
            any_var = varArray[current++];
            current = current % length;

            //BODY
            if (!(noArg && any_var.isArgument)){
                if (Type.isSubsumeType(requireType, any_var.Type.baseType)) {
                    //function --
                    if(Type.isSubsumeType(Type.baseTypes.function, any_var.Type.baseType)){
                        if(noForbidden && Type.hasOwnProperty(any_var.Type.value, Type.specialKeys.keyFdesc) && any_var.Type.value[Type.specialKeys.keyFdesc].forbidden){
                            compatible_var = any_var;
                        }else if(Type.hasOwnProperty(any_var.Type.value, Type.specialKeys.keyFdesc) && (
                            this.isInCalling(any_var.Type.value[Type.specialKeys.keyFdesc].name) ||
                            (any_var.Type.value[Type.specialKeys.keyFdesc].useType !== "" && fUseType !== "" && any_var.Type.value[Type.specialKeys.keyFdesc].useType !== fUseType) ||
                                // We don't use tagged template anymore.
                            //fUseType === Type.FuncUseTypes.template && (any_var.Type.value[Type.specialKeys.keyFdesc].isBuiltin === true && any_var.Type.value[Type.specialKeys.keyFdesc].needThis === true ))
                            noNeedThis && (any_var.Type.value[Type.specialKeys.keyFdesc].needThis === true )
                            )
                        ) {
                            compatible_var = any_var;
                        } else if( variableFrist && !any_var.Type.value[Type.specialKeys.keyIsCustom] ) {
                            compatible_var = any_var;
                        }
                        else {
                            foundVar = any_var;
                            break;
                        }
                    }
                    else {
                        foundVar = any_var;
                        break;
                    }
                }
                else if (Type.isSubsumeType(any_var.Type.baseType, requireType)) {
                    compatible_var = any_var;
                }
            }

            //BREAK CONDITION
            if(current === end)
                break;
        }

        //RANDOM ITERATE END
        if( foundVar ){
            return foundVar;
        }
        else if( compatible_var && strict === false){
            return compatible_var;
        }


        if(cur_scope.parent)
            return this.getVariable(cur_scope.parent, requireType, true, variableFrist, strict, noForbidden, noNeedThis);


        //(TODO use outer scope variable?
        return null;
    }

    getBuiltin(requireType , strict=false, fUseType = "", noNeedThis = false){
        let foundVar;
        let any_var;
        let cur_scope = this.globalScope;
        let varArray = cur_scope.vars;
        if(varArray.length === 0)
            return null;
        let compatible_var;

        //RANDOM ITERATE START
        //INIT
        let length = varArray.length;
        let end = util.randRange(0, length);
        let current = end;
        while (true) {
            any_var = varArray[current++];
            current = current % length;
            //BODY
            if( Type.isSubsumeType(requireType,any_var.Type.baseType) ) {
                if(Type.isSubsumeType(Type.baseTypes.function, any_var.Type.baseType)){
                    if ( !(noNeedThis && (any_var.Type.value[Type.specialKeys.keyFdesc].needThis === true )) ) {
                        foundVar = any_var;
                        break;
                    }
                }else {
                    foundVar = any_var;
                    break;
                }
            }
            else if( Type.isSubsumeType(any_var.Type.baseType, requireType)){
                compatible_var = any_var;
            }
            //BREAK CONDITION
            if(current === end)
                break;
        }
        //RANDOM ITERATE END

        if( foundVar ){
            return foundVar;
        }
        else if( compatible_var && strict === false){
            return compatible_var;
        }
        return null;
    }

    getVariableBuiltin(requireType, strict, variableFirst=false, noForbidden=false, fUseType = "", noNeedThis = false){
        let variable;
        if( variableFirst || util.randRange(0, 4) ) {
            variable = this.getVariable(this.currentScope, requireType, false, variableFirst,strict, noForbidden, fUseType, noNeedThis);
            if (variable)
                return variable;
            variable = this.getBuiltin(requireType, strict, fUseType, noNeedThis);
            if (variable)
                return variable;
            util.unreachable();
        }
        else{
            variable = this.getBuiltin(requireType, strict, fUseType, noNeedThis);
            if(variable)
                return variable;
            variable = this.getVariable(this.currentScope, requireType, false, variableFirst,strict, noForbidden, fUseType, noNeedThis);
            if(variable)
                return variable;
            util.unreachable();
        }
        util.unreachable();
    }
    //Variable
    createVariable(){
        let name = "v" + this.varNumber++;
        let varName = Variable.createVarName(name,name);
        let variable = new Variable(varName);
        //(DEBUG_CHECK
        if(debug)
            variable = util.getDebugProxy(variable);
        //)DEBUG_CHECK
        return variable;
    }
    registerVariable(variable){

        if(debug && variable.Type.baseType !== Type.baseTypes.null && variable.Type.value === null) {
            throw new util.DebugError("Invalid Type");
        }
        this.currentScope.vars.push(variable);
    }
    createVariableWithName(boxed,origin, isArgument = false){
        let varName = Variable.createVarName(boxed,origin);
        let variable = new Variable(varName, isArgument);
        //(DEBUG_CHECK
        if(debug)
            variable = util.getDebugProxy(variable);
        //)DEBUG_CHECK
        return variable;
    }

    createBuiltinVariable(varName){
        let variable = new Variable(varName);
        variable.isBuiltin = true;
        return variable;
    }
    getVirtualValue(varName){
        return this.Sandbox[varName];
    }

    createTypeLiteral(baseType){
        if(debug && baseType === "undefined")
            util.unreachable();
        let type = new Type(baseType);
        type.baseType = baseType;
        switch(baseType){
            case Type.baseTypes.function:
            case Type.baseTypes.constructor: {
                util.unreachable();
                break;
            }
            case Type.baseTypes.array: {
                type.value = this.Sandbox.Array();
                Object.defineProperty(type.value, Type.specialKeys.keyTypeRef, {
                    enumerable: false,
                    writable: false,
                    configurable: false,
                    value:type
                });
                break;
            }
            case Type.baseTypes.object: {
                type.value = this.Sandbox.Object();
                Object.defineProperty(type.value, Type.specialKeys.keyTypeRef, {
                    enumerable: false,
                    writable: false,
                    configurable: false,
                    value:type
                });
                break;
            }

        }

        //(DEBUG_CHECK
        if(debug) {
            type = util.getDebugProxy(type);
        }
        //)DEBUG_CHECK
        return type;
    }
    createBareType(baseType){
        let type = new Type(baseType);
        type.baseType = baseType;
        //(DEBUG_CHECK
        if(debug) {
            type = util.getDebugProxy(type);
        }
        //)DEBUG_CHECK
        return type;
    }
    createTypeFunction(nodePair, funcName){
        let code = Type.functionTrapCodeFront + funcName + Type.functionTrapCodeTail;
        let func = Type.vmAnalyzeCode(this.Sandbox,code);
        let scope = this.createScope(this.currentScope);
        Object.defineProperty(func, Type.specialKeys.keyFdesc, {
            enumerable: false,
            writable: false,
            configurable: false,
            value:Type.createFDesc(scope)
        });
        Object.defineProperty(func, Type.specialKeys.keyIsCustom, {
            enumerable: false,
            writable: false,
            configurable: false,
            value:true
        });
        Object.defineProperty(func, Type.specialKeys.keyApply, {
            enumerable: false,
            writable: false,
            configurable: false,
            value:this.Sandbox.apply_
        });
        func[Type.specialKeys.keyFdesc].nodePair = nodePair;
        func[Type.specialKeys.keyFdesc].name = funcName;
        this.registerFdesc(func[Type.specialKeys.keyFdesc]);

        return Type.createTypeWith(func);
    }

    createBuiltinType(baseType, object){
        let type = new Type(baseType);
        type.isBuiltin = true;
        type.value = object;

        Object.defineProperty(object, Type.specialKeys.keyTypeRef, {
            enumerable: false,
            writable: false,
            configurable: false,
            value:type
        });

        //(DEBUG_CHECK
        if(debug){
            type = util.getDebugProxy(type);
        }
        //)DEBUG_CHECK
        return type;
    }
    registerFdesc(fdesc){
        if(this.fdescMap.has(fdesc.name))
            throw new util.DebugError();
        if((fdesc.name) === "")
            throw new util.DebugError();
        if(fdesc.name.length === 0)
            throw new util.DebugError();
        this.fdescMap.set(fdesc.name, fdesc);
    }
    getFdesc(name){
        return this.fdescMap.get(name);
    }
    initSandbox(generator){
        this.Sandbox = {};
        //(TODO to avoid sandbox escaping
        this.Sandbox.__proto__ = null;
        V8EnvInit.initSandbox(this,generator);
    }
    renewRootCode(){
        let code = Type.vmGenCode(this.program.ast) + '\n';
        this.Recorder.CodeRecorder.writeRootFile(code);
    }
    eraseOriginCode(fname=""){
        this.Recorder.CodeRecorder.eraseOriginFile(fname);
    }
    updateOriginCode(ast){
        if(ast.type === "BlockStatement"){
            let program = es6.createNode("Program");
            program.body = ast;
            ast = program;
        }
        let code = Type.vmGenCode(ast) + '\n';
        this.Recorder.CodeRecorder.updateOriginFile(code);
    }
    updateBoxedCode(ast){
        let code = Type.vmGenCode(ast) + '\n';
        this.Recorder.CodeRecorder.updateBoxedFile(code);
    }
    createVariablesWith(keys, targets){
        for(let key of keys) {
            let target = targets[key];
            let type;
            let baseType = typeof target;
            if (Type.isSubsumeType(Type.baseTypes.object, baseType)) {
                if (debug && !Type.hasOwnProperty(target,Type.specialKeys.keyTypeRef)) {
                    util.unreachable();
                }
                type = target[Type.specialKeys.keyTypeRef];
            } else {
                type = Type.createTypeWith(target);
            }
            let variable = this.createVariable();
            variable.Type = type;
            this.registerVariable(variable);
        }
    }
    createArgumentWith(target, number){
        let type;
        let baseType = typeof target;
        if (Type.isSubsumeType(Type.baseTypes.object, baseType) && target !== null && Type.hasOwnProperty(target, Type.specialKeys.keyTypeRef) ) {
            type = target[Type.specialKeys.keyTypeRef];
        } else {
            type = Type.createTypeWith(target);
        }
        let name = "a" + number;
        let variable = this.createVariableWithName(name,name, true);
        variable.Type = type;
        this.registerVariable(variable);
        return variable;
    }
}



const environment = {
    Scope:Scope,
    Type:Type,
    Variable:Variable,
    typeDB:null,
    propertyTypeMap:null,
    needThisList:null,
    //Key, outType
    //Environment
    createRuntime(program){
        let runtime = new Runtime(program, environment);
        this.runtime = runtime;
        //sandbox is the biggest object that are sandboxed, and recorded.
        //runtime.sandbox = runtime.Recorder.ObjectRecorder.recordObject(runtime.sandbox);
        return runtime;
    },

    //Variabale
    checkOutType(cur_node){
        let baseType = cur_node.outType.baseType;
        let value = cur_node.outType.value;
        //(DEBUG_CHECK
        if(debug) {
            if (typeof cur_node.outType !== "object") {
                util.unreachable();
            }
        }
        //)DEBUG_CHECK
    },
    isContainNonPrintable(data){
        return /[\x00-\x1F\x80-\xFF]/.test(data);
    },
    updateType(key, _Type){
        if(config.doUpdateType) {
            if (key.substr(0, 3) === "_x_" || key.substr(0, 3) === "_f_" || !isNaN(key) || this.isContainNonPrintable(key))
                return;

            if (!Type.hasOwnProperty(this.propertyTypeMap, key))
                this.propertyTypeMap[key] = [];
            if (!this.propertyTypeMap[key].includes(_Type.baseType))
                this.propertyTypeMap[key].push(_Type.baseType);
        }
    },
    writeDB(){
        this.typeDB.write();
    },
    compatibleKeyOf(keys, requireType){
        //( TODO too slow..
        let curArray = keys;
        let length = curArray.length;
        if(length === 0 )
            return null;
        let start = 0;
        let end = util.randRange(start, length);
        let current = end;


        while (true) {
            let key = curArray[current++];
            current = current % length;
            //BODY
            if( Type.hasOwnProperty(this.propertyTypeMap, key)) {
                let propTypes = this.propertyTypeMap[key];
                for( let type of propTypes)
                    if(Type.isSubsumeType(type,requireType))
                        return key;
            }else if( key.indexOf("_x_") === 0){
                //always compatible.
                return key;
            }

            //BREAK CONDITION
            if(current === end)
                break;
        }
        return null;
    },
    getCompatibleKey(requireType){
        let key;
        if( Type.isSubsumeType(Type.baseTypes.function, requireType) && util.randRange(0,3)){
            key = this.getCompatibleKeyFrom(requireType,this.preferedKeys);
            if(key)
                return key;
        }
        return this.getCompatibleKeyFrom(requireType,this.propertyKeys);
    },
    getCompatibleKeyFrom(requireType, fromArray){
        //RANDOM ITERATE START
        //INIT

        let curArray = fromArray;
        let length = curArray.length;
        if(length === 0 )
            return null;

        let start = 0;
        let end = util.randRange(start, length);
        let current = end;

        while (true) {
            let key = curArray[current++];
            current = current % length;
            //BODY
            let propTypes = this.propertyTypeMap[key];
            for( let type of propTypes)
                if(Type.isSubsumeType(type,requireType))
                    return key;
            //BREAK CONDITION
            if(current === end)
                break;
        }
        return null;
        //RANDOM ITERATE END
    },
    getCompatibleSymbolKey(requireType){
        let curArray = this.symbolKeys;
        let length = curArray.length;
        if(length === 0 )
            return null;

        let start = 0;
        let end = util.randRange(start, length);
        let current = end;

        while (true) {
            let key = curArray[current++];
            current = current % length;
            //BODY
            let propTypes = this.symbolTypeMap[key];
            for( let type of propTypes)
                if(Type.isSubsumeType(type,requireType))
                    return "Symbol." + key;
            //BREAK CONDITION
            if(current === end)
                break;
        }
        return null;
    },
    logNeedThis(fname){
        if( fname.substr(0,3) === "_x_" || fname.substr(0,3) === "_f_" || !isNaN(fname) || fname.includes(" "))
            return;

        if( !this.needThisList.includes(fname) && fname !== ""){
            this.needThisList.push(fname);
        }
    },
    commitNeedThis(){
        let data = JSON.stringify(this.needThisList);
        fs.writeFileSync(config.needThisListPath, data);

    }

};




{
    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');

    let propAdapter = new FileSync(config.propertyTypeDBPath);
    environment.typeDB = low(propAdapter);
    environment.propertyTypeMap = environment.typeDB.value();
    const definedTypes = require("./hotsixPropertyType.js");
    Object.assign(environment.propertyTypeMap, definedTypes);

    environment.needThisList = JSON.parse(fs.readFileSync(config.needThisListPath));

    Object.prototype[Type.specialKeys.keyHostCorruptionCheck] = true;
    //////// Special Primitive Value//////////////////////////////
    environment.interestingIntegersStrict = [
        0x10,0x40,0x100,0x400, 0x1000,0x4000, 0x10000,0x40000
    ];
    if(debug){
        environment.interestingIntegers  = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 64,

            127, 128, 129,
            255, 256, 257,
            511, 512, 513,
            1000,
            1023, 1024, 1025,
            4095, 4096, 4097,
            10000,
            65535, 65536, 65537,

        ];
    } else {
        environment.interestingIntegers = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 64,

            127, 128, 129,
            255, 256, 257,
            511, 512, 513,
            1000,
            1023, 1024, 1025,
            4095, 4096, 4097,
            10000,
            65535, 65536, 65537,
            //268435456, 536870912, 1073741824,
            //2147483647, 2147483648, 2147483649,
            4294967169, 4294967295, 4294967296, 4294967297
            //9007199254740991, 9007199254740992, 9007199254740993,
        ];
    }
    environment.interestingDoubles = [1.1,2.2];
    environment.interestingSymbols = ["asyncIterator", "hasInstance", "isConcatSpreadable", "iterator", "match", "matchAll", "replace", "search", "species", "split", "toPrimitive", "toStringTag", "unscopables"];
    environment.propertyKeys = Object.keys(environment.propertyTypeMap);
    environment.preferedKeys = ["valueOf","toString"];
    //(TODO supporting async function
    //environment.symbolKeys = ["asyncIterator", "hasInstance", "isConcatSpreadable", "iterator", "match", "matchAll", "replace", "search", "species", "split", "toPrimitive", "toStringTag", "unscopables"];
    environment.symbolKeys = ["hasInstance", "isConcatSpreadable", "search", "species", "split", "toPrimitive", "toStringTag", "unscopables"];
    environment.symbolTypeMap = {
        "hasInstance": [
            Type.baseTypes.function
        ],
        "isConcatSpreadable": [
            Type.baseTypes.any
        ],
        "search": [
            Type.baseTypes.function
        ],
        "species": [
            Type.baseTypes.function
        ],
        "split": [
            Type.baseTypes.function
        ],
        "toPrimitive": [
            Type.baseTypes.function
        ],
        "toStringTag": [
            Type.baseTypes.function
        ],
        "unscopables": [
            Type.baseTypes.object
        ]
    };

    environment.interestingStrings = environment.propertyKeys;
};

module.exports = environment;

//Init


