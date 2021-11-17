const util = require("./../Util");
const es6 = require("./ESTree").es6;
const env = require("./Environment/Environment.js");
const Type = require("./Environment/Type");
const config = require("./../Config");

const debug = config.debug;

var now = require("performance-now");

/*
let min_body_length = 5;
let max_body_length = 20;

let max_expressions_length = 3;
let max_array_length = 20;
let max_object_length = 20;
let min_param_length = 1;
let max_param_length = 4;
let max_template_length = 5;
let max_properties_length = 5;
let max_method_definition = 5;
let max_cases_length = 5;
*/

let min_body_length = 1;
let max_body_length = 3;

let max_expressions_length = 2;
let max_array_length = 2;
let max_object_length = 2;
let min_param_length = 2;
let max_param_length = 2;
let max_template_length = 2;

let min_cases_length = 1;
let max_cases_length = 3;

let single_statement_coefficient = 4;
let max_properties_length = 2;
let max_elements_length = 2;
let max_method_definition = 2;




var generator = {
    GenBoolean(){
        return !util.randRange(0,2);
    },
    GenPlus(){
        let sel = util.randRange(0,1+1+3);
        switch (true) {
            case (sel < 1): {
                return util.randRange(0, 0x10000);
            }
            case (sel < 1+1): {
                return util.chooseRandom(env.interestingIntegers);
            }
            case (sel < 1+1+3): {
                let target = util.chooseRandom(env.interestingIntegersStrict)
                target = target * util.randRange(1,4);
                if(sel < 1+1+1)
                    target = target - 1;
                else if(sel < 1+1+2)
                    target = target  +1;
                return target;
            }

        }
    },
    GenDouble(){
        return Math.random()*0x1000;
    },
    GenString(){
        //("t" + Math.random().toString(36).substring(2, util.randRange(1,5)));
        return util.chooseRandom(env.interestingStrings);

    },
    GenSymbol(){
        return util.chooseRandom(env.interestingSymbols);
    },
    GenBigInt(){
        return BigInt(generator.GenPlus());
    },
    GeneratorLiteralList:[Type.baseTypes.int,Type.baseTypes.plus,Type.baseTypes.double,Type.baseTypes.boolean,Type.baseTypes.string,Type.baseTypes.bigint,Type.baseTypes.symbol],
    SymbolLiteral(symbol_name){

        let boxed_curNode =  es6.createNode("MemberExpression");
        let origin_curNode =  es6.createNode("MemberExpression");

        let boxed_objectNode = generator.EmptyIdentifier();
        let origin_objectNode = generator.EmptyIdentifier();

        boxed_objectNode.name = "Symbol";
        origin_objectNode.name = "Symbol";

        let boxed_property = generator.EmptyLiteral();
        let origin_property = generator.EmptyLiteral();

        boxed_property.value = symbol_name;
        boxed_property.raw = symbol_name;

        origin_property.value = symbol_name;
        origin_property.raw = symbol_name;

        boxed_curNode.object = boxed_objectNode;
        boxed_curNode.effect = false;

        origin_curNode.object = origin_objectNode;
        origin_curNode.effect = false;

        boxed_curNode.property = boxed_property;
        origin_curNode.property = origin_property;

        boxed_curNode.outType = Type.createTypeWith(generator.runtime.Sandbox.Symbol[symbol_name]);
        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);
        return cur_nodes;

    },
    Literal(baseType = null) {
        let boxed_literalNode = es6.createNode("Literal");
        let origin_literalNode = es6.createNode("Literal");
        let literalValue;

        let outType;
        let stringed;
        if(baseType === null) {
            baseType = util.chooseRandom(generator.GeneratorLiteralList);
        }

        switch(baseType){
            case Type.baseTypes.int:{
                literalValue = generator.GenPlus();
                stringed = literalValue.toString();
                outType = env.runtime.createTypeLiteral(Type.baseTypes.int);
                break;
            }
            case Type.baseTypes.plus:{
                literalValue = generator.GenPlus();
                stringed = literalValue.toString();
                outType = env.runtime.createTypeLiteral(Type.baseTypes.plus);
                break;
            }
            case Type.baseTypes.double:{
                literalValue = generator.GenDouble();
                stringed = literalValue.toString();
                outType = env.runtime.createTypeLiteral(Type.baseTypes.double);
                break;
            }
            case Type.baseTypes.string:{
                literalValue = generator.GenString();
                stringed = literalValue.toString();
                outType = env.runtime.createTypeLiteral(Type.baseTypes.string);
                break;
            }
            case Type.baseTypes.boolean:{
                literalValue = generator.GenBoolean();
                stringed = literalValue.toString();
                outType = env.runtime.createTypeLiteral(Type.baseTypes.boolean);
                break;
            }
            //https://v8.dev/features/bigint
            case Type.baseTypes.bigint:{
                literalValue = BigInt(generator.GenPlus());
                stringed = literalValue.toString() + "n";
                boxed_literalNode.bigint = stringed;
                origin_literalNode.bigint = stringed;
                outType = env.runtime.createTypeLiteral(Type.baseTypes.bigint);
                break;
            }
            case Type.baseTypes.symbol:{
                let symbol_name  = util.chooseRandom(env.interestingSymbols);
                let cur_nodes = generator.SymbolLiteral(symbol_name);
                generator.pushNon(cur_nodes);
                return;
            }
            default:{
                util.unreachable();
            }
        }


        outType.value = literalValue;

        boxed_literalNode.value = literalValue;
        boxed_literalNode.raw = stringed;
        boxed_literalNode.effect = false;
        boxed_literalNode.outType = outType;

        origin_literalNode.value = literalValue;
        origin_literalNode.raw = stringed;

        let cur_nodes = es6.createNodePair(boxed_literalNode,origin_literalNode);

        if(  (Type.isSubsumeType(Type.baseTypes.number, outType.baseType)|| (Type.baseTypes.bigint === outType.baseType) ) && baseType !== Type.baseTypes.plus  && !util.randRange(0,3)){
            cur_nodes = generator.UnaryExpression(cur_nodes);
        }
        generator.pushNon(cur_nodes);

    },
    EmptyIdentifier() {
        return es6.createNode("Identifier");
    },
    EmptyLiteral(){
        return es6.createNode("Literal");
    },
    IdentifierForDeclaration(variable){
        let boxed_curNode = es6.createNode("Identifier");
        let origin_curNode = es6.createNode("Identifier");
        boxed_curNode.name = variable.varName.boxed;
        origin_curNode.name = variable.varName.origin;
        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;
    },

    IdentifierWithVariable(variable) {
        let boxed_curNode = es6.createNode("Identifier");
        let origin_curNode = es6.createNode("Identifier");

        //variable.useNodes.push(boxed_curNode);
        boxed_curNode.name = variable.varName.boxed;
        origin_curNode.name = variable.varName.origin;

        boxed_curNode.outType = variable.Type;
        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;
    },

    GenExpression(effectConstraint=false){
        while(true) {
            //(DEBUG_CHECK
            if(debug){
                if(generator.lengthEffect() > 1)
                    util.unreachable();
            }
            //)DEBUG_CHECK

            if (generator.isEmptyAny()) {
                if (!util.randRange(0, 4)) {
                    generator.Literal();
                } else {
                    generator.Identifier();
                }
                continue;
            } else if ( effectConstraint && !generator.isEmptyEffect() ){
                return generator.popEffect();
            }

            let boxed_lookup = generator.getAny().boxed;
            let lookup_value = boxed_lookup.outType.value;

            //now "object" do not subsume "null". this check should be correct
            if( !util.randRange(0,5) && Type.isSubsumeType(Type.baseTypes.object, generator.getAny().boxed.outType.baseType )){
                generator.LoadMemberExpression();
                continue;
            }

            if( boxed_lookup.type !== "FunctionExpression" &&  Type.isSubsumeType(Type.baseTypes.function, boxed_lookup.outType.baseType ) && util.randRange(0,3) &&
            //if( boxed_lookup.type !== "FunctionExpression" &&  Type.isSubsumeType(Type.baseTypes.function, boxed_lookup.outType.baseType ) &&
                    ( (!debug &&  Type.hasOwnProperty(lookup_value,Type.specialKeys.keyFdesc) && !lookup_value[Type.specialKeys.keyFdesc].forbidden && !generator.runtime.isInCalling(lookup_value[Type.specialKeys.keyFdesc].name)
                            && !( lookup_value[Type.specialKeys.keyFdesc].needThis === true && boxed_lookup.type !== "MemberExpression" )
                            && generator.runtime.scopeStack.length < 4)
                        || (debug && generator.runtime.scopeStack.length < 10 && Type.hasOwnProperty(lookup_value, Type.specialKeys.keyFdesc) && !lookup_value[Type.specialKeys.keyFdesc].forbidden)
                ))
            {
                generator.CallExpression();
                continue;
            }

            //(DEBUG_CHECK
            if(debug && generator.isEmptyAny())
                util.unreachable();
            //)DEBUG_CHECK

            if (!util.randRange(0, 3)){
                this[es6.getFunctionOf("Expressions")]();
                continue;
            }

            return generator.popAny();
        }
    },

    GenStatement(){
        let stmt_pair;
        generator.Identifier();
        let num;

        //not support throwStatement
        num = util.randRange(0, 40 + 40 + 1);

        let lookupType = generator.getAny().boxed.outType;

        if(debug && !lookupType)
            throw util.DebugError("Invalid Type Created");
        if( (num < 40) && Type.isSubsumeType( Type.baseTypes.object, lookupType.baseType ) && Object.isExtensible(lookupType.value)) {
            stmt_pair = generator.ExpressionStatement();//StoreMember
        } else if( num < (40 + 40) ){
            stmt_pair = generator.VariableDeclaration();
        } else if (num < (40 + 40 + 1)) {
            stmt_pair = generator.TryStatement();
        } else{
            stmt_pair = generator.ThrowStatement();
        }
        return stmt_pair;
    },
    GenStatementIntial(number){
        let stmt_pair;
        let size = Type.initialTypeArray.length;
        number = number % size;
        let baseType = Type.initialTypeArray[number];
        if(Type.isSubsumeType(Type.baseTypes.primitive,baseType)) {
            generator.Literal(baseType);
        }
        else{
            if(baseType === Type.baseTypes.object)
                generator.ObjectExpression(true);
            else if(baseType === Type.baseTypes.array)
                generator.ArrayExpression(true);
            else if(baseType === Type.baseTypes.function)
                generator.FunctionExpression();
            else{
                util.unreachable();
            }
        }

        stmt_pair = generator.VariableDeclaration(true);
        return stmt_pair;
    },
    Generate(program){
        try{
            generator.runCnt++;
            if(config.useJITFormat)
                generator.JITProgram(program);
            else
                generator.Program(program);
        }catch(e){
            generator.errorCnt++;
            generator.handleUpperTryException(0);
            throw e;
        }
        return program.ast;
    },
    Program() {
        generator.resetGenerator();
        generator.runtime.initSandbox(generator);
        generator.runtime.Recorder.CodeRecorder.eraseAllFile();
        let program = generator.runtime.program;
        let cur_node = program.ast;
        let contextLevel = generator.pushContext(program.scope , cur_node);
        if(debug)util.proxyDebugOn=true;

        for(let stmtNum=0; stmtNum <= config.totallines; stmtNum++){
            let stmts;

            switch (true){
                case (stmtNum < Type.initialTypeArray.length):{
                    stmts = generator.GenStatementIntial(stmtNum);
                    break;
                }
                default :{
                    stmts = generator.GenStatement();
                    break;
                }
            }

            if (generator.functionInited) {
                generator.functionInited = false;
                generator.runtime.eraseOriginCode();
                generator.runtime.updateOriginCode(cur_node);
            }

            cur_node.body.push(stmts.origin);

            if(generator.blockCriticalInserted) {
                generator.runtime.renewRootCode();
            }else
                generator.runtime.updateOriginCode(stmts.origin);
            generator.runtime.updateBoxedCode(stmts.boxed);


            //(DEBUG_CHECK
            if(debug) {
                if (!generator.isEmptyEffect()) {
                    util.lprint(generator.lengthEffect());
                    util.dumpAst(generator.effectStack);
                    util.unreachable()
                }
            }
            //)DEBUG_CHECK
        }

        generator.popContext();

        if(debug)util.proxyDebugOn=false;
        if(config.doWriteDB)env.writeDB();
        if(config.doWriteNT)env.commitNeedThis();
        return cur_node;

    },
    JITProgram() {
        generator.resetGenerator();
        generator.runtime.initSandbox(generator);
        generator.runtime.Recorder.CodeRecorder.eraseAllFile();
        let program = generator.runtime.program;
        let cur_node = program.ast;
        let contextLevel = generator.pushContext(program.scope , cur_node);
        if(debug)util.proxyDebugOn=true;

        let functionVariable;
        let samecalls;

        for(let stmtNum=0; stmtNum <= config.totallines; stmtNum++){
            let stmts;

            switch (true){
                case (stmtNum < Type.initialTypeArray.length):{
                    stmts = generator.GenStatementIntial(stmtNum);
                    break;
                }

                case ( (stmtNum === (Math.floor(config.totallines/2) - 1))) : {
                    functionVariable = generator.runtime.getVariableBuiltin(Type.baseTypes.function , true,true,  true);
                    stmts =  generator.SpecialCallStatement( functionVariable,"%PrepareFunctionForOptimization");
                    break;
                }

                case ( (stmtNum === (Math.floor(config.totallines/2) ) ) ) : {
                    stmts =  generator.CallStatement(functionVariable);
                    samecalls = stmts;
                    break;
                }

                case ( (stmtNum === (Math.floor(config.totallines/2)+1 ) ) ) : {
                    stmts =  generator.SpecialCallStatement( functionVariable,"%OptimizeFunctionOnNextCall");
                    break;
                }
                case ( (stmtNum === (Math.floor(config.totallines/2)+2 ) ) ) : {
                    let code = Type.vmGenCode(samecalls.origin);
                    generator.currentBlock.body.push(samecalls.origin);
                    Type.vmAnalyzeCode(generator.runtime.Sandbox, code);
                    generator.currentBlock.body.pop();
                    stmts =  samecalls;
                    break;
                }

                case ( (stmtNum === (config.totallines) )   ) : {
                    stmts =  generator.CallStatement(functionVariable);
                    break;
                }

                default :{
                    stmts = generator.GenStatement();
                    break;
                }
            }

            if (generator.functionInited) {
                generator.functionInited = false;
                generator.runtime.eraseOriginCode();
                generator.runtime.updateOriginCode(cur_node);
            }

            cur_node.body.push(stmts.origin);

            if(generator.blockCriticalInserted) {
                generator.runtime.renewRootCode();
            }else
                generator.runtime.updateOriginCode(stmts.origin);
            generator.runtime.updateBoxedCode(stmts.boxed);


            //(DEBUG_CHECK
            if(debug) {
                if (!generator.isEmptyEffect()) {
                    util.lprint(generator.lengthEffect());
                    util.dumpAst(generator.effectStack);
                    util.unreachable()
                }
            }
            //)DEBUG_CHECK
        }

        generator.popContext();

        if(debug)util.proxyDebugOn=false;
        if(config.doWriteDB)env.writeDB();
        if(config.doWriteNT)env.commitNeedThis();
        return cur_node;
    },
    FunctionInitialization(args){
        if(debug && !Type.hasOwnProperty(args.callee,Type.specialKeys.keyFdesc) )
            util.unreachable();
        let fdesc = args.callee[Type.specialKeys.keyFdesc];
        fdesc.inited = 2;

        let origin_function = fdesc.nodePair.origin;
        let boxed_function = fdesc.nodePair.boxed;
        let origin_block = origin_function.body;
        let boxed_block = boxed_function.body;
        //This is to remove generator_.TrapHandler() code.
        boxed_block.body.length = 0;

        generator.pushContext(fdesc.scope, origin_block, fdesc.name, generator.callingStateTemp);
        fdesc.useType = generator.callingStateTemp;
        //(TODO this code can be optimized
        let cnt = 0;
        for(let arg of args){
            let variable = generator.runtime.createArgumentWith(arg,cnt++);
            fdesc.params.push(variable.Type);
            let id_pair = generator.IdentifierWithVariable(variable);
            origin_function.params.push(id_pair.origin);
            boxed_function.params.push(id_pair.boxed);
            generator.runtime.registerVariable(variable);
        }

        let desc = Object.getOwnPropertyDescriptor(args.callee , "length");
        if(desc.configurable) {
            desc.value = cnt;
            Object.defineProperty(args.callee, "length", desc);
        }

        let stmt_cnt;
        if(!generator.firstCalledFunction) {
            stmt_cnt = util.randRange(config.function_initiallines + 8, config.function_initiallines + 16 );
            generator.firstCalledFunction = true;
        }
        else{
            stmt_cnt = util.randRange(config.function_initiallines + 2, config.function_initiallines + 6);
        }

        let returnValue;
        for(let stmtNumber=0;stmtNumber<stmt_cnt;stmtNumber++){
            let stmtPair;
            if(stmtNumber === (stmt_cnt-1)){
                stmtPair = generator.GenReturnStatement();
                returnValue = stmtPair.boxed.outType.value;
                if(debug && Type.isSubsumeType(Type.baseTypes.object,stmtPair.boxed.outType.baseType ) && returnValue[Type.specialKeys.keyHostCorruptionCheck])
                    throw new util.DebugError("Host was corrupted");
            }else{
                if(stmtNumber < config.function_initiallines)
                    stmtPair = generator.GenStatementIntial(stmtNumber);
                else
                    stmtPair = generator.GenStatement(true);
            }

            origin_block.body.push(stmtPair.origin);
            boxed_block.body.push(stmtPair.boxed);

            if (generator.functionInited) {
                generator.functionInited = false;
                generator.runtime.eraseOriginCode(fdesc.name);
                generator.runtime.updateOriginCode(origin_block);
            }else{
                generator.runtime.updateOriginCode(stmtPair.origin);
            }

            if(debug) {
                if (!generator.isEmptyEffect()) {
                    util.lprint(generator.lengthEffect(), "!!!");
                    util.dumpAst(generator.effectStack);
                    util.unreachable()
                }
            }
        }

        fdesc.code = Type.vmGenCode(boxed_function);
        fdesc.function = Type.vmAnalyzeCode(generator.runtime.Sandbox,"(" + fdesc.code + ")");

        fdesc.inited = true;
        generator.popContext();

        return returnValue;
    },

    //Calling from virtual env
    //This must return virtual env's value.
    TrapHandler(args){
        let fdesc;
        if ( !Type.hasOwnProperty(args.callee, Type.specialKeys.keyFdesc)) {
            fdesc = generator.runtime.getFdesc(args.callee.name);
            Object.defineProperty(args.callee, Type.specialKeys.keyFdesc, {
                enumerable: false,
                writable: false,
                configurable: false,
                value: fdesc
            });
            Object.defineProperty(args.callee, Type.specialKeys.keyApply, {
                enumerable: false,
                writable: false,
                configurable: false,
                value: generator.runtime.Sandbox.apply_
            });
        } else {
            fdesc = args.callee[Type.specialKeys.keyFdesc];
        }

        if(debug)util.lprint("entering: ", args.callee.name);
        let return_val;
        generator.runtime.insertCalling(fdesc.name);
        if(!fdesc.inited){
            if(debug)util.lprint("making: ", args.callee.name);
            return_val = generator.FunctionInitialization(args);
            if(debug)util.lprint("making end: ", args.callee.name);
            generator.functionInited = true;
        }else if ( fdesc.inited === 2 ){
            //Infinite recursive call state.
            util.abort();
        }else {

            if(!fdesc.function) {
                throw new util.DebugError("fdesc.function not defined");
            }
            return_val = fdesc.function[Type.specialKeys.keyApply](this, args);

        }
        generator.runtime.removeCalling(fdesc.name);

        if(debug)util.lprint("leaving: ", args.callee.name);
        return return_val;
    },

    CallStatement(variable){
        let boxed_curNode = es6.createNode("ExpressionStatement");
        let origin_curNode = es6.createNode("ExpressionStatement");


        let functionIds = generator.IdentifierWithVariable(variable);
        functionIds.boxed.effect = true;
        generator.pushEffect(functionIds);
        generator.CallExpression();
        let calls = generator.popAny();

        boxed_curNode.expression = calls.boxed;
        origin_curNode.expression = calls.origin;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;
    },
    SpecialCallStatement(variable, nativeSyntaxName){

        let boxed_curNode = es6.createNode("ExpressionStatement");
        let origin_curNode = es6.createNode("ExpressionStatement");

        let boxed_id = generator.EmptyIdentifier();
        let origin_id = generator.EmptyIdentifier();
        boxed_id.name = nativeSyntaxName;
        origin_id.name = nativeSyntaxName;

        let boxed_call = es6.createNode("CallExpression");
        let origin_call = es6.createNode("CallExpression");

        boxed_call.callee = boxed_id;
        origin_call.callee = origin_id;

        let arg_pair = generator.IdentifierWithVariable(variable);
        let boxed_arg = arg_pair.boxed;
        let origin_arg = arg_pair.origin;

        boxed_call.arguments.push(boxed_arg);
        origin_call.arguments.push(origin_arg);

        boxed_curNode.expression = boxed_call;
        origin_curNode.expression = origin_call;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;

    },


    ExpressionStatement(){
        let boxed_curNode = es6.createNode("ExpressionStatement");
        let origin_curNode = es6.createNode("ExpressionStatement");
        generator.AssignmentExpression();
        let assignments = generator.popAny();
        let boxed_assignment = assignments.boxed;
        let origin_assignment = assignments.origin;
        boxed_curNode.expression = boxed_assignment;
        origin_curNode.expression = origin_assignment;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;
    },
    Directive(parent_node,parent_scope){

    },
    FillBlockStatement(block_pair){
        let boxed_curNode = block_pair.boxed;
        let origin_curNode = block_pair.origin;

        //(TODO
        for(let i=0;i<util.randRange(1,4);i++){
            let stmts = generator.GenStatement();
            boxed_curNode.body.push(stmts.boxed);
            origin_curNode.body.push(stmts.origin);
        }
    },

    EmptyStatement(){
        util.unreachable();
    },
    DebuggerStatement(){
        util.unreachable();
    },
    WithStatement(){
        util.unreachable();
    },
    //control flow
    GenReturnStatement(){
        let boxed_curNode = es6.createNode("ReturnStatement");
        let origin_curNode = es6.createNode("ReturnStatement");
        let exp_pair = generator.GenExpression();
        boxed_curNode.argument = exp_pair.boxed;
        boxed_curNode.outType = exp_pair.boxed.outType;
        origin_curNode.argument = exp_pair.origin;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;
    },
    LabeledStatement(){
        util.unreachable();
    },
    BreakStatement(){
        util.unreachable();
    },
    ContinueStatement(){
        util.unreachable();
    },
    //condition statement
    IfStatement(){
        util.unreachable();
    },
    SwitchStatement(){
        util.unreachable();
    },
    SwitchCase(){
        util.unreachable();
    },
    ThrowStatement(){
        let boxed_curNode = es6.createNode("ThrowStatement");
        let origin_curNode = es6.createNode("ThrowStatement");

        let expressions = generator.GenExpression();
        boxed_curNode.argument = expressions.boxed;
        origin_curNode.argument = expressions.origin;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;
    },
    TryStatement(){

        let boxed_curNode = es6.createNode("TryStatement");
        let origin_curNode = es6.createNode("TryStatement");

        let boxed_tryblock = es6.createNode("BlockStatement");
        let origin_tryblock = es6.createNode("BlockStatement");

        boxed_curNode.block = boxed_tryblock;
        origin_curNode.block = origin_tryblock;

        let try_pair = es6.createNodePair(boxed_tryblock, origin_tryblock);

        let catch_pair = generator.CatchClause();
        let boxed_catch = catch_pair.boxed;
        let origin_catch = catch_pair.origin;

        boxed_curNode.handler = boxed_catch;
        origin_curNode.handler = origin_catch;

        let boxed_final = es6.createNode("BlockStatement");
        let origin_final = es6.createNode("BlockStatement");
        boxed_curNode.finalizer = boxed_final;
        origin_curNode.finalizer = origin_final;
        let final_pair = es6.createNodePair(boxed_final, origin_final);

        generator.currentBlock.body.push(origin_curNode);
        let tryIdx = generator.currentBlock.body.length-1;

        let contextIdx = generator.pushContext(generator.runtime.createScope(generator.runtime.currentScope, false), origin_tryblock);
        generator.exceptionStack.push({currentBlock:generator.currentBlock,tryIdx:tryIdx});
        let exceptionLevel = generator.exceptionStack.length;
        let exception;

        //try block {
        {
            try {
                generator.FillBlockStatement(try_pair);
            } catch (e) {
                exception = e;
            }
        }

        //catch block {
        {
            //upper exception may not handled.
            generator.handleUpperTryException(exceptionLevel);
            generator.recoverContext(contextIdx);
            if (!exception) {
                //no exception occured so catch block will not be executed. use non-effect node.
                let call_pair = generator.VirtualCallStatement();

                boxed_catch.body.body.push(call_pair.boxed);
                origin_catch.body.body.push(call_pair.origin);

            } else {
                //Exception occur.
                //Exception caused by primitive operation must be host env object.
                //So we need to translate this into a vm_env object in this case.

                //There might be unhandled node.

                if (exception instanceof Object) {
                    let name = exception.name;
                    switch (name) {
                        case "EvalError": {
                            exception = generator.runtime.Sandbox.EvalError();
                            break;
                        }
                        case "RangeError": {
                            exception = generator.runtime.Sandbox.RangeError();
                            break;
                        }
                        case "ReferenceError": {
                            exception = generator.runtime.Sandbox.ReferenceError();
                            break;
                        }
                        case "SyntaxError": {
                            exception = generator.runtime.Sandbox.SyntaxError();
                            break;
                        }
                        case "TypeError": {
                            exception = generator.runtime.Sandbox.TypeError();
                            break;
                        }
                        case "URIError": {
                            exception = generator.runtime.Sandbox.URIError();
                            break;
                        }
                        default : {
                            //Error was caused by host. throw this.
                            throw exception;
                            break;
                        }
                    }
                }
                let boxed_block = boxed_catch.body;
                let origin_block = origin_catch.body;
                let block_pair = es6.createNodePair(boxed_block, origin_block);

                let scope = generator.runtime.createScope(generator.runtime.currentScope, false);
                generator.pushContext(scope, origin_block);

                generator.runtime.createArgumentWith(exception, "_exception");
                generator.FillBlockStatement(block_pair);

                generator.popContext();
            }
        }

        //fianlly block
        {
            let origin_block = final_pair.origin;
            let scope = generator.runtime.createScope(generator.runtime.currentScope, false);
            generator.pushContext(scope, origin_block);

            generator.FillBlockStatement(final_pair);

            generator.popContext();
        }

        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);

        generator.currentBlock.body.splice(tryIdx, 1);

        if(debug && exceptionLevel !== generator.exceptionStack.length){
                throw new util.DebugError("Exception level is not handled")
        }
        generator.exceptionStack.pop();
        return cur_nodes;
    },

    CatchClause() {
        let boxed_curNode = es6.createNode("CatchClause");
        let origin_curNode = es6.createNode("CatchClause");

        let boxed_block = es6.createNode("BlockStatement");
        let origin_block = es6.createNode("BlockStatement");

        boxed_curNode.body = boxed_block;
        origin_curNode.body = origin_block;

        let boxed_e = generator.EmptyIdentifier();
        boxed_e.name = "a_exception";
        let origin_e = generator.EmptyIdentifier();
        origin_e.name = "a_exception";

        boxed_curNode.param = boxed_e;
        origin_curNode.param = origin_e;

        return es6.createNodePair(boxed_curNode,origin_curNode);
    },

    //declaration
    FunctionDeclaration(){
        util.unreachable();
    },

    FunctionExpression(variables=null){
        //FunctionExpression does not consume any effect(or non-effect) stack.
        //So there must not be any effect stack.
        if(!generator.isEmptyEffect()) {
            generator.pushAny(generator.GenExpression());
            return;
        }
        let boxed_curNode = util.deepCopy(Type.functionTrapAst);
        let origin_curNode = es6.createNode("FunctionExpression");
        boxed_curNode.effect = true;
        boxed_curNode.expression = false;
        let funcName = "_f_" + generator.runtime.functionNumber++;
        let boxed_id = this.EmptyIdentifier();
        boxed_id.name = funcName;
        boxed_curNode.id = boxed_id;

        origin_curNode.expression = false;
        let origin_id = this.EmptyIdentifier();
        origin_id.name = funcName;
        origin_curNode.id = origin_id;

        let origin_block = es6.createNode("BlockStatement");
        origin_curNode.body = origin_block;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        let value = generator.runtime.createTypeFunction(cur_nodes, funcName);
        if(!Type.hasOwnProperty( value.value, Type.specialKeys.keyTypeRef)){
            util.unreachable();
        }
        //FunctionExpresion does not need analyzation.
        generator.pushEffect(cur_nodes);
        generator.runtime.logRecord(generator.effectStack);
        boxed_curNode.outType = value;
        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },
    ArrowFunctionExpression(leftChild){
        util.unreachable();
    },

    VariableDeclaration(initial_phase = false){
        let boxed_curNode = es6.createNode("VariableDeclaration");
        let origin_curNode = es6.createNode("VariableDeclaration");
        boxed_curNode.kind = "var";
        origin_curNode.kind = "var";

        let declarator_nodes = generator.VariableDeclarator(initial_phase);
        let boxed_decl = declarator_nodes.boxed;
        let origin_decl = declarator_nodes.origin;
        boxed_curNode.declarations.push(boxed_decl);
        origin_curNode.declarations.push(origin_decl);

        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);
        return cur_nodes;
    },

    VariableDeclarator(initial_phase = false){
        let boxed_curNode = es6.createNode("VariableDeclarator");
        let origin_curNode = es6.createNode("VariableDeclarator");
        boxed_curNode.effect = true;

        let expression_nodes;

        if(initial_phase)
            expression_nodes = generator.popAny();
        else
            expression_nodes = generator.GenExpression();

        let boxed_expNode = expression_nodes.boxed;
        let origin_expNode = expression_nodes.origin;
        boxed_expNode.useNode = boxed_curNode;

        let newVariable = env.runtime.createVariable();
        newVariable.Type = boxed_expNode.outType;
        //execute. no need to log.
        generator.runtime.Sandbox[newVariable.varName.boxed] = newVariable.Type.value;
        generator.runtime.registerVariable(newVariable);

        boxed_curNode.init = boxed_expNode;
        origin_curNode.init = origin_expNode;

        let id_pair = generator.IdentifierForDeclaration(newVariable);
        let boxed_id = id_pair.boxed;
        let origin_id = id_pair.origin;

        boxed_id.useNode = boxed_curNode;
        boxed_curNode.id = boxed_id;
        origin_curNode.id = origin_id;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);

        //(DEBUG_CHECK
        if(debug) {
            if (newVariable.Type === null || typeof newVariable.Type === "string") {
                util.unreachable();
            }
        }
        //)DEBUG_CHECK
        return cur_nodes;
    },

    //loop
    WhileStatement(parent_node,parent_scope){
        util.unreachable();
    },
    DoWhileStatement(parent_node,parent_scope){
        util.unreachable();
    },
    ForStatement(parent_node,parent_scope){
        util.unreachable();
    },

    ForInStatement(){
        util.unreachable();
    },
    ForOfStatement(){
        util.unreachable();
    },


    //expression
    ThisExpression(){
        util.unreachable();
    },
    Identifier() {
        //
        let variable  = env.runtime.getVariableBuiltin(Type.baseTypes.any );
        if(debug && (typeof variable.varName) !== "object")
            util.unreachable();

        let boxedNode = es6.createNode("Identifier");
        //variable.useNodes.push(boxedNode);
        boxedNode.name = variable.varName.boxed;
        boxedNode.effect = false;
        boxedNode.outType = variable.Type;

        let originNode = es6.createNode("Identifier");
        originNode.name = variable.varName.origin;

        let nodes = es6.createNodePair(boxedNode,originNode);
        generator.pushNon(nodes);
    },


    ArrayExpression(zero_length=false){
        let boxed_curNode =  es6.createNode("ArrayExpression");
        let origin_curNode =  es6.createNode("ArrayExpression");
        let arrayValue = env.runtime.createTypeLiteral(Type.baseTypes.array);

        let effect = false;
        let expression_nodes;

        let boxed_expressionNode;
        let origin_expressionNode;

        let length;
        if(zero_length === true)
            length = 0;
        else
            length = util.randRange(0, max_array_length+1);
        for(let i=0;i<length;i++){
            if(i===0)
                expression_nodes = generator.GenExpression(true);
            else
                expression_nodes = generator.GenExpression();
            boxed_expressionNode = expression_nodes.boxed;
            origin_expressionNode = expression_nodes.origin;

            boxed_expressionNode.useNode = boxed_curNode;
            effect |= !!boxed_expressionNode.effect;

            boxed_curNode.elements.push(boxed_expressionNode);
            origin_curNode.elements.push(origin_expressionNode);

            //arrayValue.value.push(boxed_expressionNode.outType.value);
            arrayValue.value[i] = boxed_expressionNode.outType.value;
        }

        boxed_curNode.effect = effect;
        boxed_curNode.outType = arrayValue;

        effect = true;
        let nodes = es6.createNodePair(boxed_curNode,origin_curNode);

        generator.pushAny(nodes);

        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },

    ObjectExpression(zero_length = false){
        let boxed_objectNode =  es6.createNode("ObjectExpression");
        let origin_objectNode =  es6.createNode("ObjectExpression");
        let objectValue = env.runtime.createTypeLiteral(Type.baseTypes.object);

        let effect = false;
        let length;
        if(zero_length === true)
            length = 0;
        else
            length = util.randRange(0, max_object_length+1);

        for(let i=0;i<length;i++){
            let keyName = "_x_" + i;
            let property_nodes = generator.Property(keyName,i);
            let boxed_propNode = property_nodes.boxed;
            let origin_propNode = property_nodes.origin;
            boxed_propNode.useNode = boxed_objectNode;

            boxed_objectNode.properties.push(boxed_propNode);
            origin_objectNode.properties.push(origin_propNode);

            effect |= !!boxed_propNode.effect;
            //(TODO :supporting function property.
            objectValue.value[keyName] = boxed_propNode.outType.value;
        }

        boxed_objectNode.effect = effect;
        boxed_objectNode.outType = objectValue;

        effect = true;
        let nodes = es6.createNodePair(boxed_objectNode,origin_objectNode);
        generator.pushAny(nodes);

        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_objectNode);
        }
        //)DEBUG_CHECK
    },

    Property(keyName,number){
        let boxed_curNode =  es6.createNode("Property");
        let origin_curNode =  es6.createNode("Property");

        let boxed_id = generator.EmptyIdentifier();
        let origin_id = generator.EmptyIdentifier();
        boxed_id.name = keyName;
        boxed_curNode.key = boxed_id;
        origin_id.name = keyName;
        origin_curNode.key = origin_id;

        let value_nodes;
        let kind = "init";
        if(number === 0)
            value_nodes = generator.GenExpression(true);
        else
            value_nodes = generator.GenExpression();

        let boxed_valueNode = value_nodes.boxed;
        let origin_valueNode = value_nodes.origin;

        boxed_valueNode.useNode = boxed_curNode;
        boxed_curNode.effect = boxed_valueNode.effect;
        boxed_curNode.outType = boxed_valueNode.outType;

        boxed_curNode.kind = kind;
        boxed_curNode.value = boxed_valueNode;

        origin_curNode.kind = kind;
        origin_curNode.value = origin_valueNode;
        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
        return cur_nodes;
    },

    UnaryExpression(childs=null){

        //PreEffect Expression
        let operator;
        let boxed_curNode =  es6.createNode("UnaryExpression");
        let origin_curNode =  es6.createNode("UnaryExpression");
        boxed_curNode.prefix = true;
        origin_curNode.prefix = true;

        let argument_pair;
        let boxed_argument;
        let origin_argument;
        if(childs === null) {
            argument_pair = generator.GenExpression(true);
            boxed_argument = argument_pair.boxed;
            origin_argument = argument_pair.origin;
            let operators = Type.getCompatibleUnaryOperators(boxed_argument.outType.baseType);
            operator = operators[util.randRange(0, operators.length)];
        } else {
            operator = "-";
            argument_pair = childs;
            boxed_argument = argument_pair.boxed;
            origin_argument = argument_pair.origin;
        }

        boxed_argument.useNode = boxed_curNode;
        boxed_curNode.argument = boxed_argument;
        origin_curNode.argument = origin_argument;

        if( boxed_argument.effect || Type.checkIsEffective(boxed_argument.outType) )
            boxed_curNode.effect = true;

        boxed_curNode.operator = operator;
        origin_curNode.operator = operator;

        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);

        //(TODO need vmAnalyze?
        generator.enterCritical(origin_curNode);

        boxed_curNode.outType = Type.unaryResultType(operator, boxed_argument.outType);

        generator.leaveCritical();

        if(childs === null)
            generator.pushAny(cur_nodes);

        //generator.runtime.sandbox.operand1 = boxed_argument.outType.value;
        //let code = operator + " operand1";
        //boxed_curNode.outType = generator.runtime.createValueWith(Type.vmAnalyzeCode(generator.program.runtime,code));


        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
        //Unary should return cur_nodes if it is called from Literal
        if(childs !== null)
            return cur_nodes;
    },
    UpdateExpression(leftChild){
        //Prohibited
        util.unreachable()
    },
    BinaryExpression(){
        //PreEffect Expression
        let boxed_curNode =  es6.createNode("BinaryExpression");
        let origin_curNode =  es6.createNode("BinaryExpression");

        let effect = false;
        let lefts = generator.GenExpression(true);
        let boxed_left = lefts.boxed;
        let origin_left = lefts.origin;

        boxed_left.useNode = boxed_curNode;
        boxed_curNode.left = boxed_left;
        origin_curNode.left = origin_left;

        if( boxed_left.effect || Type.checkIsEffective(boxed_left.outType) )
            effect = true;

        let rights = generator.GenExpression();
        let boxed_right = rights.boxed;
        let origin_right = rights.origin;
        if( boxed_right.effect || Type.checkIsEffective(boxed_right.outType) )
            effect = true;

        let operators = Type.getCompatibleBinaryOperators(boxed_left.outType.baseType, boxed_right.outType.baseType);
        let operator = operators[util.randRange(0,operators.length)];

        if( operator === "in" || operator === "instanceof")
            effect = true;

        boxed_curNode.operator = operator;
        origin_curNode.operator = operator;

        boxed_right.useNode = boxed_curNode;
        boxed_curNode.right = boxed_right;
        origin_curNode.right = origin_right;

        boxed_curNode.effect = effect;
        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);

        generator.enterCritical(origin_curNode);

        //(TODO need vmAnalyze?
        boxed_curNode.outType = Type.binaryResultType(operator, boxed_left.outType, boxed_right.outType);

        generator.leaveCritical();
        generator.pushAny(cur_nodes);

        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },
    //Only for StoreField Assignment
    AssignmentExpression(){
        let objectLookup = generator.getAny().boxed;
        //(DEBUG_CHECK
        if(debug) {
            //StoreField is only possible for object.
            if (!Type.isSubsumeType(Type.baseTypes.object, objectLookup.outType.baseType))
                util.unreachable();
        }
        //)DEBUG_CHECK

        let boxed_curNode =  es6.createNode("AssignmentExpression");
        let origin_curNode =  es6.createNode("AssignmentExpression");

        let operator = "=";
        boxed_curNode.operator = operator;
        origin_curNode.operator = operator;

        // StoreMember operation's sequence is
        // (1).(last) = (2 ~~~~)
        let objectNodes = generator.popAny();

        let rights = generator.GenExpression();
        let boxed_right = rights.boxed;
        let origin_right = rights.origin;
        boxed_right.useNode = boxed_curNode;
        boxed_curNode.right = boxed_right;
        origin_curNode.right = origin_right;

        generator.StoreMemberExpression(objectNodes, boxed_right.outType.baseType);
        let storeMembers = generator.popEffect();
        let boxed_storeMember = storeMembers.boxed;
        let origin_storeMember = storeMembers.origin;
        boxed_storeMember.useNode = boxed_curNode;
        boxed_curNode.left = boxed_storeMember;
        origin_curNode.left = origin_storeMember;


        //assignment is always effective
        boxed_curNode.effect = true;
        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);

        //StoreMember always has object outType. .
        //generator.runtime.logRecord(generator.effectStack);
        generator.enterCritical(origin_curNode);

        boxed_storeMember.outType.value[boxed_storeMember.property.raw] = boxed_right.outType.value;
        boxed_curNode.outType = boxed_right.outType;

        generator.leaveCritical();

        generator.pushAny(cur_nodes);
        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },

    //LoadField Expression
    LoadMemberExpression(){
        let objectNodes = generator.getAny();
        let boxed_objectNode = objectNodes.boxed;
        let origin_objectNode = objectNodes.origin;

        //just call GenExpression() Will not be problem.
        //becuase MemberExpression can't be called from effectConstraint=true.
        //Check Possible
        //(TODO supporting primitive __proto__, prototype
        if( !Type.isSubsumeType(Type.baseTypes.object, boxed_objectNode.outType.baseType) || boxed_objectNode.outType.value === null) {
            generator.pushAny(generator.GenExpression());
            return;
        }

        let boxed_curNode =  es6.createNode("MemberExpression");
        let origin_curNode =  es6.createNode("MemberExpression");

        boxed_objectNode.useNode = boxed_curNode;
        boxed_curNode.object = boxed_objectNode;
        boxed_curNode.effect = true;
        origin_curNode.object = origin_objectNode;


        let object = boxed_objectNode.outType.value;

        let anyKeys = Type.getKeys(object);
        //let anyKeys = Object.keys(object);

        if(anyKeys.length === 0 ) {
            generator.pushAny(generator.GenExpression());
            return;
        }

        if( (!util.randRange(0, 2) || anyKeys.length === 0) && !Type.hasOwnProperty(object,Type.specialKeys.keyIsBuiltin)  ){
            let key;
            if( util.randRange(0, 4) && Type.isSubsumeType(Type.baseTypes.function, typeof object) )
                key = "prototype";
            else {
                let proto = object.__proto__;
                if(Type.isSubsumeType(Type.baseTypes.primitive, typeof proto) || proto === null || Type.getKeys(proto).length === 0)
                    key = "__proto__";
                else {
                    let anyKeys = Type.getKeys(proto);
                    key = anyKeys[util.randRange(0, anyKeys.length)];
                    if(!Type.hasOwnProperty(object,key)){
                        object = proto;
                    }
                }
            }

            //pop for "objectNode = generator.getAny()"
            generator.popAny();

            let boxed_literalNode = generator.EmptyLiteral();
            let origin_literalNode = generator.EmptyLiteral();

            boxed_literalNode.useNode = boxed_curNode;
            boxed_literalNode.value = key;
            boxed_literalNode.raw = key;
            boxed_curNode.property = boxed_literalNode;

            origin_literalNode.value = key;
            origin_literalNode.raw = key;
            origin_curNode.property = origin_literalNode;

            //(TODO we must move this code below the log.
            generator.enterCritical(origin_curNode);
            let property = object[key];
            generator.leaveCritical();

            if( property === undefined || property === null){
                generator.pushAny(generator.GenExpression());
                return;
            }
            let outType = Type.createTypeWith(property);

            if(config.doWriteDB )
                env.updateType(key,outType);

            let cur_nodes = es6.createNodePair(boxed_curNode ,origin_curNode);

            //generator.runtime.logRecord(generator.effectStack);
            boxed_curNode.outType = outType;
            //no need to log. already renew rootcode.
            generator.pushAny(cur_nodes);

            //(DEBUG_CHECK
            if( debug && !Type.isSubsumeType(Type.baseTypes.primitive, typeof property) && property[Type.specialKeys.keyHostCorruptionCheck]) {
                throw new util.DebugError("Host was corrupted");
            }
            //)DEBUG_CHECK

        } else {
            let key = anyKeys[util.randRange(0, anyKeys.length)];

            let boxed_literalNode = generator.EmptyLiteral();
            let origin_literalNode = generator.EmptyLiteral();

            boxed_literalNode.useNode = boxed_curNode;
            boxed_literalNode.value = key;
            boxed_literalNode.raw = key;
            boxed_curNode.property = boxed_literalNode;

            origin_literalNode.value = key;
            origin_literalNode.raw = key;
            origin_curNode.property = origin_literalNode;

            generator.enterCritical(origin_curNode);
            let property = object[key];
            generator.leaveCritical();

            //pop for "objectNode = generator.getAny()"
            generator.popAny();
            let outType = Type.createTypeWith(property);
            if(config.doWriteDB)
                env.updateType(key,outType);
            let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);

            //generator.runtime.logRecord(generator.effectStack);
            boxed_curNode.outType = outType;
            generator.pushAny(cur_nodes);
        }

        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },

    //MemberExpression for StoreField Expression ( Assignment Expression )
    StoreMemberExpression(objectNodes, assignValueType) {
        let boxed_objectNode = objectNodes.boxed;
        let origin_objectNode = objectNodes.origin;

        if(debug){
            //AssignmentExpression should check type of objectNode.
            if (!Type.isSubsumeType(Type.baseTypes.object, boxed_objectNode.outType.baseType))
                util.unreachable();
        }

        let boxed_curNode =  es6.createNode("MemberExpression");
        let origin_curNode =  es6.createNode("MemberExpression");

        boxed_curNode.object = boxed_objectNode;
        boxed_curNode.effect = true;
        origin_curNode.object = origin_objectNode;

        let object = boxed_objectNode.outType.value;
        let anyKeys = Type.getKeys(object);
        if(util.randRange(0,2))
            anyKeys = anyKeys.reverse();

        let selectedKey = env.compatibleKeyOf(anyKeys, assignValueType);

        //We checked that object is always extensible.
        //(TODO supporting "__proto__","prototype"

        if( selectedKey && util.randRange(0,2) && !(selectedKey === "prototype" && Type.hasOwnProperty(object,Type.specialKeys.keyIsBuiltin)) ){
            if( anyKeys.length === 0 )
                util.unreachable();
            //Store in existing.
            let key = selectedKey;

            let boxed_literal = generator.EmptyLiteral();
            let origin_literal = generator.EmptyLiteral();

            boxed_literal.value = key;
            boxed_literal.raw = key;
            boxed_curNode.property = boxed_literal;

            origin_literal.value = key;
            origin_literal.raw = key;
            origin_curNode.property = origin_literal;

        } else {
            //Create new property.
            let key;
            let isSymbol = false;
            if(boxed_objectNode.outType.baseType === Type.baseTypes.array && util.randRange(0,4)){
                if(util.randRange(0,2))
                    key = anyKeys.length.toString();
                else
                    key = generator.GenPlus().toString();
            }
            else {
                let sel = util.randRange(0,8);

                switch (true) {
                    case (sel < 1): {
                        key = env.getCompatibleKey(assignValueType);
                        if(key)
                            break;
                        key = env.getCompatibleSymbolKey(assignValueType);
                        if(key) {
                            isSymbol = true;
                        }
                        break;
                    }
                    case (sel < 2 ): {
                        key = env.getCompatibleSymbolKey(assignValueType);
                        if(key) {
                            isSymbol = true;
                            break;
                        }
                        key = env.getCompatibleKey(assignValueType);
                        break;
                    }
                    case (sel < 3 ): {
                        if(util.randRange(0,2))
                            key = anyKeys.length.toString();
                        else
                            key = generator.GenPlus().toString();
                        break;
                    }
                    default:{
                        break;
                    }
                }
                if(!key)
                    key = "_x_" + anyKeys.length;
            }
            //(CURRENT_DEBUG

            if( debug && (key === undefined || key === "undefined")) {
                throw new util.DebugError("invalid key:  key === undefined");
            }

            let boxed_property;
            let origin_property;
            if(isSymbol){
                boxed_property = generator.EmptyIdentifier();
                origin_property = generator.EmptyIdentifier();

                boxed_property.name = key;
                origin_property.name = key;

            }else{
                boxed_property = generator.EmptyLiteral();
                origin_property = generator.EmptyLiteral();

                boxed_property.value = key;
                boxed_property.raw = key;

                origin_property.value = key;
                origin_property.raw = key;
            }
            boxed_curNode.property = boxed_property;
            origin_curNode.property = origin_property;
        }

        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);

        generator.pushEffect(cur_nodes);
        boxed_curNode.outType = boxed_objectNode.outType;

        //(DEBUG_CHECK
        if( debug ){
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },
    LogicalExpression(){
        //NonEffect Expression
        let boxed_curNode =  es6.createNode("LogicalExpression");
        let origin_curNode =  es6.createNode("LogicalExpression");
        let length = es6.LogicalOperator.length;
        let operator = es6.LogicalOperator[util.randRange(0,length)];
        boxed_curNode.operator = operator;
        origin_curNode.operator = operator;

        let lefts = generator.GenExpression(true);
        let boxed_left = lefts.boxed;
        let origin_left = lefts.origin;

        boxed_left.useNode = boxed_curNode;
        boxed_curNode.left = boxed_left;
        origin_curNode.left = origin_left;

        let rights;

        if(  (operator==="||" && boxed_left.outType.value) || (operator==="&&" && !boxed_left.outType.value) )  {
            //Need virtual node.
            rights = generator.VirtualCallExpression();
        }else{
            rights = generator.GenExpression();
        }

        let boxed_right = rights.boxed;
        let origin_right = rights.origin;

        boxed_right.useNode = boxed_curNode;
        boxed_curNode.right = boxed_right;
        origin_curNode.right = origin_right;

        boxed_curNode.effect = !!boxed_left.effect | !!boxed_right.effect;
        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);
        //analyze
        generator.pushAny(cur_nodes);
        generator.runtime.logRecord(generator.effectStack);
        boxed_curNode.outType = Type.logicalResultType(operator, boxed_left.outType, boxed_right.outType);

        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },
    ConditionalExpression(){
        let boxed_curNode =  es6.createNode("ConditionalExpression");
        let origin_curNode =  es6.createNode("ConditionalExpression");

        let tests = generator.GenExpression(true);
        let boxed_test = tests.boxed;
        let origin_test = tests.origin;
        boxed_test.useNode = boxed_curNode;
        boxed_curNode.test = boxed_test;
        origin_curNode.test = origin_test;

        if(boxed_test.outType.value) {
            let consequents = generator.GenExpression();
            let boxed_consequent = consequents.boxed;
            let origin_consequent = consequents.origin;
            boxed_consequent.useNode = boxed_curNode;

            //fake node.
            let alternates = generator.VirtualCallExpression();
            let boxed_alternate = alternates.boxed;
            let origin_alternate = alternates.origin;
            boxed_alternate.useNode = boxed_curNode;

            boxed_curNode.consequent = boxed_consequent;
            boxed_curNode.alternate = boxed_alternate;
            boxed_curNode.effect = !!boxed_test.effect | !!boxed_consequent.effect;

            origin_curNode.consequent = origin_consequent;
            origin_curNode.alternate = origin_alternate;

            let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);
            generator.pushAny(cur_nodes);
            boxed_curNode.outType = boxed_consequent.outType;
        }
        else {
            //fake node.
            let consequents = generator.VirtualCallExpression();
            let boxed_consequent = consequents.boxed;
            let origin_consequent = consequents.origin;
            boxed_consequent.useNode = boxed_curNode;


            let alternates = generator.GenExpression();
            let boxed_alternate = alternates.boxed;
            let origin_alternate = alternates.origin;
            boxed_alternate.useNode = boxed_curNode;

            boxed_curNode.consequent = boxed_consequent;
            boxed_curNode.alternate = boxed_alternate;
            boxed_curNode.effect = !!boxed_test.effect | !!boxed_consequent.effect;

            origin_curNode.consequent = origin_consequent;
            origin_curNode.alternate = origin_alternate;

            let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);
            generator.pushAny(cur_nodes);
            boxed_curNode.outType = boxed_alternate.outType;
        }

        //no analyze need
        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },


    VirtualCallStatement(){
        let boxed_curNode = es6.createNode("ExpressionStatement");
        let origin_curNode = es6.createNode("ExpressionStatement");
        let calls = generator.VirtualCallExpression();
        let boxed_call = calls.boxed;
        let origin_call = calls.origin;
        boxed_curNode.expression = boxed_call;
        origin_curNode.expression = origin_call;

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        return cur_nodes;
    },
    VirtualCallExpression(){
        let variable = generator.runtime.getVariableBuiltin(Type.baseTypes.function , true);
        let functionIds = generator.IdentifierWithVariable(variable);
        generator.CallExpression(functionIds);
        return generator.popAny();
    },
    CallExpression(fakeFunctions=null){

        let function_nodes;
        if(fakeFunctions)//If functions is not null, this means fake call.
            function_nodes = fakeFunctions;
        else
            function_nodes = generator.popAny();

        let boxed_functionNode = function_nodes.boxed;
        let origin_functionNode = function_nodes.origin;
        //(DEBUG_CHECK
        //Should be functionNode
        if( debug && !Type.isSubsumeType(Type.baseTypes.function, boxed_functionNode.outType.baseType ) )
            util.unreachable();
        //)DEBUG_CHECK
        let this_;
        if( boxed_functionNode.type === "MemberExpression" ){
            this_ = boxed_functionNode.object.outType.value
        }else{
            this_ = null;
        }

        let boxed_curNode;
        let origin_curNode;
        let doNewCall = false;
        if( Type.isSubsumeType(Type.baseTypes.constructor, boxed_functionNode.outType.baseType )  ){
            doNewCall = true;
            boxed_curNode = es6.createNode("NewExpression");
            origin_curNode = es6.createNode("NewExpression");
        }else{
            boxed_curNode = es6.createNode("CallExpression");
            origin_curNode = es6.createNode("CallExpression");
        }

        boxed_curNode.effect = true;

        let functionValue = boxed_functionNode.outType.value;
        boxed_curNode.callee = boxed_functionNode;
        boxed_functionNode.useNode = boxed_curNode;

        origin_curNode.callee = origin_functionNode;

        let Param = [];
        if( Type.hasOwnProperty(functionValue, Type.specialKeys.keyFdesc)){
            let fdesc = functionValue[Type.specialKeys.keyFdesc];

            if(fdesc.inited === true){
                for(let type of fdesc.params){
                    let requireType = type.baseType;
                    if( requireType === Type.baseTypes.constructor){
                        requireType = Type.baseTypes.function;
                    }
                    if(!Type.isSubsumeType(Type.baseTypes.any,requireType))
                        requireType = Type.baseTypes.any;

                    let variable = generator.runtime.getVariableBuiltin(requireType,true, false, false, "", true);

                    Param.push(variable.Type.value);
                    let identifier_pair = generator.IdentifierWithVariable(variable);
                    boxed_curNode.arguments.push(identifier_pair.boxed);
                    origin_curNode.arguments.push(identifier_pair.origin);

                }
            }else{
                let size = util.randRange(2,4);
                for(let i=0;i<size;i++) {
                    let variable;
                    while(true) {
                        //(TODO it is just for to avoid selecting undefined type.
                        variable = generator.runtime.getVariableBuiltin(Type.baseTypes.object, true, false, false, "", true);
                        //(TODO prevent infinite loop..
                        if( variable.Type.value !== functionValue)
                            break;
                    }
                    Param.push(variable.Type.value);
                    if(variable.Type.value ===undefined)
                        util.unreachable();
                    let identifier_pair = generator.IdentifierWithVariable(variable);
                    boxed_curNode.arguments.push(identifier_pair.boxed);
                    origin_curNode.arguments.push(identifier_pair.origin);
                }
            }
        }
        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);

        //(DEBUG_CHECK
        if( debug ){
            util.lprint("call function level:", generator.runtime.scopeStack.length);
            util.lprint(Type.vmGenCode(boxed_curNode));
        }
        //)DEBUG_CHECK

        if(!fakeFunctions) {
            //execute
            let val;
            generator.enterCritical(origin_curNode);
            generator.callingStateTemp = Type.FuncUseTypes.call;
            try {

                if(doNewCall) {
                    switch (Param.length) {

                        case 0: {
                            val = new functionValue();
                            break;
                        }
                        case 1: {
                            val = new functionValue(Param[0]);
                            break;
                        }
                        case 2: {
                            val = new functionValue(Param[0],Param[1]);
                            break;
                        }
                        case 2: {
                            val = new functionValue(Param[0],Param[1],Param[2]);
                            break;
                        }
                        default:{
                            util.unreachable();
                        }
                    }
                }else
                    val = functionValue[Type.specialKeys.keyApply](this_, Param);

            }catch(e){
                let msg = e.toString();
                if(config.doWriteNT && (msg.includes(`Cannot convert undefined or null`) || msg.includes("called on null or undefined") ))
                    env.logNeedThis(functionValue.name);
                throw e;
            }

            generator.leaveCritical();

            let type = Type.createTypeWith(val);
            boxed_curNode.outType = type;
        } else {
            let type = generator.runtime.createTypeLiteral(Type.baseTypes.primitive);
            boxed_curNode.outType = type;
        }

        generator.pushAny(cur_nodes);
        //(DEBUG_CHECK
        if (debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
    },

    NewExpression(){
        util.unreachable();
    },
    SequenceExpression(){
        util.unreachable();
    },
    YieldExprLession() {
        util.unreachable();
    },
    TaggedTemplateExpression() {

        let boxed_curNode = es6.createNode("TaggedTemplateExpression");
        let origin_curNode = es6.createNode("TaggedTemplateExpression");
        boxed_curNode.effect = true;
        let variable = generator.runtime.getVariableBuiltin(Type.baseTypes.function,true, false, true, Type.FuncUseTypes.template, true);
        let id_pair = generator.IdentifierWithVariable(variable);

        boxed_curNode.tag = id_pair.boxed;
        origin_curNode.tag = id_pair.origin;

        let template_pair = generator.TemplateLiteral(true);
        let boxed_template = template_pair.boxed;
        let origin_template = template_pair.origin;
        boxed_curNode.quasi = boxed_template;
        origin_curNode.quasi = origin_template;


        let resultString = "operand1`";
        let operandArr = [];
        generator.runtime.Sandbox.operand1 = id_pair.boxed.outType.value;
        generator.runtime.Sandbox.operand2 = operandArr;

        for(let i=0; i<boxed_template.quasis.length*2-1; i++){
            if(i%2 === 0){
                resultString += boxed_template.quasis[ Math.floor(i/2) ].outType.value;
            }else{
                resultString += "${operand2[" + Math.floor(i/2) + "]}";
                operandArr.push(boxed_template.expressions[ Math.floor(i/2 ) ].outType.value);
            }
        }
        resultString += "`";
        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);

        //(DEBUG_CHECK
        if( debug ){
            util.lprint("TaggedTemplateExpression level:", generator.runtime.scopeStack.length);
            util.lprint(Type.vmGenCode(boxed_curNode));
        }
        //)DEBUG_CHECK

        //no need to log. we will just update rootcode
        //(TODO this is so time consuming. need a more effcient way
        generator.enterCritical(origin_curNode);
        generator.callingStateTemp = Type.FuncUseTypes.template;
        let resultValue = Type.vmAnalyzeCode(generator.runtime.Sandbox, resultString);

        generator.leaveCritical();
        generator.pushAny(cur_nodes);

        let type = Type.createTypeWith(resultValue);
        boxed_curNode.outType = type;
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
    },
    TemplateLiteral(fromTag=false) {
        let boxed_curNode = es6.createNode("TemplateLiteral");
        let origin_curNode = es6.createNode("TemplateLiteral");

        let resultString = "";

        let expression_nodes;
        let boxed_expressionNode;
        let origin_expressionNode;
        let expressions_length = util.randRange(1,max_template_length+1);
        for (let i = 0; i < expressions_length*2 + 1; i++) {
            if(i%2 === 0) {
                let element_nodes = generator.TemplateElement();

                boxed_curNode.quasis.push(element_nodes.boxed);
                origin_curNode.quasis.push(element_nodes.origin);
                resultString += element_nodes.boxed.outType.value;
            } else {
                if(i===1)//first
                    expression_nodes = generator.GenExpression(true);
                else
                    expression_nodes = generator.GenExpression();
                boxed_expressionNode = expression_nodes.boxed;
                origin_expressionNode = expression_nodes.origin;
                boxed_expressionNode.useNode = boxed_curNode;
                boxed_curNode.expressions.push(boxed_expressionNode);
                origin_curNode.expressions.push(origin_expressionNode);

                boxed_curNode.effect |= !!boxed_expressionNode.effect;
                if(!fromTag) {
                    //Maybe this makes same effect as in real code.
                    resultString += boxed_expressionNode.outType.value;

                }
            }
        }

        let cur_nodes = es6.createNodePair(boxed_curNode, origin_curNode);
        //analyze
        if(!fromTag) {
            generator.pushAny(cur_nodes);
            generator.runtime.logRecord(generator.nonEffectStack);
            boxed_curNode.outType = env.runtime.createTypeLiteral(Type.baseTypes.string);
            boxed_curNode.outType.value = resultString;
            //(DEBUG_CHECK
            if(debug) {
                env.checkOutType(boxed_curNode);
            }
            //)DEBUG_CHECK
        }else{
            return cur_nodes;
        }

    },
    TemplateElement() {
        let boxed_curNode = es6.createNode("TemplateElement");
        let origin_curNode = es6.createNode("TemplateElement");

        let tail = !util.randRange(0,2);
        boxed_curNode.tail = tail;
        origin_curNode.tail = tail;

        let string = generator.GenString();
        boxed_curNode.value = {
            cooked: string,
            raw: string
        };
        origin_curNode.value = {
            cooked: string,
            raw: string
        };

        let cur_nodes = es6.createNodePair(boxed_curNode,origin_curNode);
        boxed_curNode.outType = env.runtime.createTypeLiteral(Type.baseTypes.string);
        boxed_curNode.outType.value = string;

        //(DEBUG_CHECK
        if(debug) {
            env.checkOutType(boxed_curNode);
        }
        //)DEBUG_CHECK
        return cur_nodes;
    },


    updateRootCode(){
        generator.runtime.renewRootCode();
    },
    clearAny(){
        if(generator.effectStack.length)
            util.unreachable();
        generator.nonEffectStack.length = 0;
    },
    pushAny(nodes){
        if(debug && (!nodes.boxed || !nodes.origin)){
            util.unreachable();
        }

        if(nodes.boxed.effect){
            generator.pushEffect(nodes);
        }else{
            generator.pushNon(nodes);
        }
    },
    isEmptyAny(){
        if(generator.effectStack !== null)
            return ( generator.effectStack.length ===0 && generator.nonEffectStack.length ===0 )
        else
            return true;
    },
    popAny(){
        if(!generator.isEmptyEffect()) {
            if(debug && (!generator.getEffect().boxed || !generator.getEffect().origin)){
                util.unreachable();
            }
            return generator.popEffect();
        }
        else if( !generator.isEmptyNon() ) {
            if(debug && (!generator.getNon().boxed || !generator.getNon().origin)){
                util.unreachable();
            }
            return generator.popNon();
        }
        util.unreachable();
    },
    getAny(){
        if(!generator.isEmptyEffect())
            return generator.getEffect();
        else if( !generator.isEmptyNon() )
            return generator.getNon();
        util.unreachable();
    },

    //Effect
    pushEffect(nodes){
        if(debug && (!nodes.boxed || !nodes.origin)){
            util.unreachable();
        }
        generator.nonEffectStack.length = 0;
        if(generator.effectStack.length > 0 || !nodes.boxed.effect)
            util.unreachable();
        generator.effectStack.push(nodes);
    },
    getEffect(){
        if ( generator.effectStack[0] === undefined )
            util.unreachable();
        return generator.effectStack[0];
    },
    popEffect(){
        if ( generator.effectStack.length === 0 )
            util.unreachable();
        if( generator.effectStack.length > 1)
            util.unreachable();
        return generator.effectStack.shift();
    },
    lengthEffect(){
        return generator.effectStack.length;
    },
    isEmptyEffect(){
        return generator.effectStack.length === 0;
    },

    //NonEffect
    pushNon(node){
        if(debug && (!node.boxed || !node.origin)){
            util.unreachable();
        }
        generator.nonEffectStack.push(node);
    },
    getNon(){
        if ( generator.nonEffectStack[0] === undefined )
            util.unreachable();
        return generator.nonEffectStack[0];
    },
    popNon(){
        if ( generator.nonEffectStack[0] === undefined )
            util.unreachable();
        if(generator.effectStack.length !== 0)
            util.unreachable();
        return generator.nonEffectStack.shift();
    },
    isEmptyNon(){
        return generator.nonEffectStack.length === 0;
    },
    pushContext(scope, origin_blockNode, fname="", callingState){
        let level = generator.runtime.pushScope(scope);
        generator.runtime.Recorder.CodeRecorder.setFileLevel(level);
        generator.runtime.Recorder.CodeRecorder.eraseOriginFile(fname);
        let context = {non:generator.nonEffectStack,effect:generator.effectStack,currentBlock:generator.currentBlock,callingState:generator.callingState};
        //(DEBUG_CHECK
        //(TODO is this check right?
        /*
        if(debug){
            if(!generator.isEmptyAny())
                util.unreachable();
        }
         */
        //)DEBUG_CHECK
        generator.contextStack.push(context);
        generator.nonEffectStack = [];
        generator.effectStack = [];
        generator.currentBlock = origin_blockNode;
        generator.callingState = callingState;
        return level;
    },
    popContext(){
        let context = generator.contextStack.pop();
        generator.nonEffectStack = context.non;
        generator.effectStack = context.effect;
        generator.currentBlock = context.currentBlock;
        generator.callingState = context.callingState;
        let level = generator.runtime.popScope();
        //generator.runtime.Recorder.CodeRecorder.eraseOriginFile();
        generator.runtime.Recorder.CodeRecorder.setFileLevel(level);
    },
    recoverContext(idx){
        generator.contextStack.length = idx;
        let context = generator.contextStack.pop();
        generator.nonEffectStack = context.non;
        generator.effectStack = context.effect;
        generator.currentBlock = context.currentBlock;
        generator.callingState = context.callingState;

        generator.runtime.scopeStack.length = idx;
        let level = generator.runtime.popScope();
        //generator.runtime.Recorder.CodeRecorder.eraseOriginFile();
        generator.runtime.Recorder.CodeRecorder.setFileLevel(level);
    },
    enterCritical(origin_curNode){
        let statement = es6.createNode("ExpressionStatement");
        statement.expression = origin_curNode;
        generator.currentBlock.body.push(statement);
        generator.updateRootCode();
        if(generator.currentBlock !== generator.runtime.program.ast) {
            generator.blockCriticalInserted = true;
        }
    },
    leaveCritical(){
        generator.currentBlock.body.pop();
    },
    handleUpperTryException(exceptionLevel, isTry = true){
        let unHandledLevel = generator.exceptionStack.length;
        let compared = (exceptionLevel !== unHandledLevel);
        if( compared ) {
            if (debug && isTry && (exceptionLevel !== unHandledLevel - 1)) {
                throw new util.DebugError("Invalid exception level");
            }

            for(let level = (unHandledLevel-1); level > exceptionLevel; level--){
                let exceptionInfo = generator.exceptionStack[level];
                exceptionInfo.currentBlock.body.splice(exceptionInfo.tryIdx, 1);
            }
            generator.exceptionStack.length = exceptionLevel;
        }
    },
    resetGenerator(){
        generator.nonEffectStack = null;
        generator.effectStack = null;
        generator.contextStack = [];
        generator.fdescStack = [];
        generator.functionInited = false;
        generator.blockCriticalInserted = false;
        generator.currentBlock = null;
        generator.firstCalledFunction = false;
        generator.callingState = Type.FuncUseTypes.non;
        generator.callingStateTemp = Type.FuncUseTypes.non;
        generator.exceptionStack = []
    },
    runCnt:0,
    errorCnt:0,
    nonEffectStack:null,
    effectStack:null,
    contextStack:null,
    fdescStack:null,
    functionInited:false,
    blockCriticalInserted:false,
    currentBlock:null,
    firstCalledFunction:false,
    callingState:Type.FuncUseTypes.non,
    callingStateTemp:Type.FuncUseTypes.non,
    exceptionStack:null,
};


module.exports = generator










