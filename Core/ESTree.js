const util = require("../Util.js");
const debug = require("./../Config").debug;

var RecursiveAssign = (obj, parents) => {
  for(let index in parents){
    let parent = parents[index];
    obj.parents.push(parent.type);
    obj.parentsRef.push(parent);
    RecursiveAssign(obj, parent.parentsRef);
  }
};

var DefineNode = (property, ...parents)  => {
  let obj = {};
  Object.assign(obj, property);
  obj.parents = [];
  obj.parentsRef = [];
  RecursiveAssign(obj, parents);

  return obj;
};


var RedefineNode = (src) => {
    let new_obj = {};
    Object.assign(new_obj, src);
    return new_obj;
};


// Operators

//var UnaryOperator = ["-" , "+" , "!" , "~" , "typeof" , "void" , "delete"];
//(TODO
var UnaryOperator = ["-" , "+" , "!" , "~" , "typeof"];
var EffectMathUnaryOperator = [ "-" , "~" ];
var MathUnaryOperator = [ "-" , "+" , "~" ];
var CommonUnaryOperator = ["!", "typeof"];

var UpdateOperator = ["++" , "--"];
var AllBinaryOperator = [ "==" , "!=" , "===" , "!==", "<" , "<=" , ">" , ">=", "<<" , ">>" , ">>>", "+" , "-" , "*" , "/" , "%", "|" , "^" , "&" , "in", "instanceof" ];
//(TODO
var BinaryOperator = [ "==" , "!=" , "===" , "!==", "<" , "<=" , ">" , ">=", "<<" , ">>" , ">>>", "+" , "-" , "*" , "/" , "%", "|" , "^" , "&"];
var BigIntBinaryOperator = [ "==" , "!=" , "===" , "!==", "<" , "<=" , ">" , ">=", "<<" , ">>" , "+" , "-" , "*" , "/" , "%", "|" , "^" , "&"];


var ComparisonOperator = ["==" , "!=" , "===" , "!==", "<" , "<=" , ">" , ">="];
var EqualityOperator = ["==" , "!=" , "===" , "!=="];
var AssignmentOperator = [ "=" , "+=" , "-=" , "*=" , "/=" , "%=", "<<=" , ">>=" , ">>>=", "|=" , "^=" , "&=" ];
var LogicalOperator = [ "||" , "&&" ];

// Node objects
var Node = DefineNode({type: "Node"});
var _Node = DefineNode({type: "Node"});

var Statement = DefineNode({type: "Statement"}, Node);
var _Statement = DefineNode({type: "Statement"}, Node);

var Expression = DefineNode({type: "Expression"}, Node);
var _Expression = DefineNode({type: "Expression"}, Node);

var Pattern = DefineNode({type: "Pattern"}, Node);
var _Pattern = DefineNode({type: "Pattern"}, Node);

var Declaration = DefineNode({type: "Declaration"}, Statement);
var _Declaration = DefineNode({type: "Declaration"}, Statement);

// Identifier
var Identifier = DefineNode({type: "Identifier", name: "String"}, Expression, Pattern);
var _Identifier = DefineNode({type: "Identifier", name: undefined }, Expression, Pattern);

// Literal
var Literal = DefineNode({type: "Literal", value: ["String", "Boolean", "null", "Number", "RegExp"], bigint:undefined}, Expression);
var _Literal = DefineNode({type: "Literal", value: undefined, raw:undefined, bigint:undefined}, Expression);
//var RegExpLiteral = DefineNode({type: "RegExpLiteral", regex: {pattern: "String", flags: "String"}}, Literal);

// Programs
var Program = DefineNode({type: "Program", body: [ ["Directive" , "Statement"] ]}, Node);
var _Program = DefineNode({type: "Program", body: []}, Node);

// Statements
var ExpressionStatement = DefineNode({type: "ExpressionStatement", expression: "Expression"}, Statement);
var _ExpressionStatement = DefineNode({type: "ExpressionStatement", expression: undefined}, Statement);

var Directive = DefineNode({type: "Directive", expression: "Literal", directive: "String"}, Node);
var _Directive = DefineNode({type: "Directive", expression: undefined, directive: undefined}, Node);

var BlockStatement = DefineNode({type: "BlockStatement", body: [ ["Statement"] ]}, Statement);
var _BlockStatement = DefineNode({type: "BlockStatement", body: []}, Statement);

var EmptyStatement = DefineNode({type: "EmptyStatement"}, Statement);
var _EmptyStatement = DefineNode({type: "EmptyStatement"}, Statement);

var DebuggerStatement = DefineNode({type: "DebuggerStatement"}, Statement);
var _DebuggerStatement = DefineNode({type: "DebuggerStatement"}, Statement);

var WithStatement = DefineNode({type: "WithStatement", object: "Expression", body: "Statement"}, Statement);
var _WithStatement = DefineNode({type: "WithStatement", object: undefined, body: undefined}, Statement);

// Control flow
var ReturnStatement = DefineNode({type: "ReturnStatement", argument: ["Expression" , "null"]}, Statement);
var _ReturnStatement = DefineNode({type: "ReturnStatement", argument: undefined}, Statement);

var LabeledStatement = DefineNode({type: "LabeledStatement", label: "Identifier", body: "Statement"}, Statement);
var _LabeledStatement = DefineNode({type: "LabeledStatement", label: undefined, body: undefined}, Statement);

var BreakStatement = DefineNode({type: "BreakStatement", label: ["Identifier" , "null"]}, Statement);
var _BreakStatement = DefineNode({type: "BreakStatement", label: undefined}, Statement);

var ContinueStatement = DefineNode({type: "ContinueStatement", label: ["Identifier" , "null"]}, Statement);
var _ContinueStatement = DefineNode({type: "ContinueStatement", label: undefined}, Statement);

// Choice
var IfStatement = DefineNode({type: "IfStatement", test: "Expression", consequent: "Statement", alternate: ["Statement" , "null"]}, Statement);
var _IfStatement = DefineNode({type: "IfStatement", test: undefined, consequent: undefined, alternate: undefined}, Statement);

var SwitchCase = DefineNode({type: "SwitchCase", test: ["Expression" , "null"], consequent: [ ["Statement"] ]}, Node);
var _SwitchCase = DefineNode({type: "SwitchCase", test: undefined, consequent: []}, Node);

var SwitchStatement = DefineNode({type: "SwitchStatement", discriminant: "Expression", cases: [ ["SwitchCase"] ]}, Statement);
var _SwitchStatement = DefineNode({type: "SwitchStatement", discriminant: undefined, cases: []}, Statement);

// Exceptions
var ThrowStatement = DefineNode({type: "ThrowStatement", argument: "Expression"}, Statement);
var _ThrowStatement = DefineNode({type: "ThrowStatement", argument: undefined}, Statement);

var CatchClause = DefineNode({type: "CatchClause", param: "Pattern", body: "BlockStatement"}, Node);
var _CatchClause = DefineNode({type: "CatchClause", param: undefined, body: undefined}, Node);

var TryStatement = DefineNode({type: "TryStatement", block: "BlockStatement", handler: ["CatchClause" , "null"], finalizer: ["BlockStatement" , "null"]}, Statement);
var _TryStatement = DefineNode({type: "TryStatement", block: undefined, handler: undefined, finalizer: undefined}, Statement);

// Fuctions
var FunctionBody = DefineNode({type: "FunctionBody", body: [ ["Directive" , "Statement"] ]}, BlockStatement);
var _FunctionBody = DefineNode({type: "FunctionBody", body: []}, BlockStatement);

var Function = DefineNode({type: "Function", id: ["Identifier" , "null"], params: [ ["Pattern"] ], body: "FunctionBody"}, Node);
var _Function = DefineNode({type: "Function", id: undefined, params: [], body: undefined}, Node);

// Declarations
var FunctionDeclaration = DefineNode({type: "FunctionDeclaration", id: "Identifier"}, Function, Declaration);
var _FunctionDeclaration = DefineNode({type: "FunctionDeclaration", id: undefined, expression: false, generator:false,async:false,params:[],min:-1,max:-1,body:undefined}, Function, Declaration);

var VariableDeclaration = DefineNode({type: "VariableDeclaration", declarations: [ ["VariableDeclarator"] ], kind: "var"}, Declaration);
var _VariableDeclaration = DefineNode({type: "VariableDeclaration", declarations: [], kind: "var"}, Declaration);

var VariableDeclarator = DefineNode({type: "VariableDeclarator", id: "Pattern", init: ["Expression" , "null"]}, Node);
var _VariableDeclarator = DefineNode({type: "VariableDeclarator", id: undefined, init: undefined, variable:undefined}, Node);

// Loops
var WhileStatement = DefineNode({type: "WhileStatement", test: "Expression", body: "Statement"}, Statement);
var _WhileStatement = DefineNode({type: "WhileStatement", test: undefined, body: undefined}, Statement);

var DoWhileStatement = DefineNode({type: "DoWhileStatement", body: "Statement", test: "Expression"}, Statement);
var _DoWhileStatement = DefineNode({type: "DoWhileStatement", body: undefined, test: undefined}, Statement);

var ForStatement = DefineNode({type: "ForStatement", init: ["VariableDeclaration", "Expression", "null"], test: ["Expression" , "null"], update: ["Expression" , "null"], body: "Statement"}, Statement);
var _ForStatement = DefineNode({type: "ForStatement", init: undefined, test: undefined, update: undefined, body: undefined}, Statement);

var ForInStatement = DefineNode({type: "ForInStatement", left: ["VariableDeclaration", "Pattern"], right: "Expression", body: "Statement"}, Statement);
var _ForInStatement = DefineNode({type: "ForInStatement", left: undefined, right: undefined, body: undefined}, Statement);

// Expressions
var ThisExpression = DefineNode({type: "ThisExpression"}, Expression);
var _ThisExpression = DefineNode({type: "ThisExpression"}, Expression);

var ArrayExpression = DefineNode({type: "ArrayExpression", elements: [ ["Expression" , "null"] ]}, Expression);
var _ArrayExpression = DefineNode({type: "ArrayExpression", elements: []}, Expression);

var ObjectExpression = DefineNode({type: "ObjectExpression", properties: [ ["Property"] ]}, Expression);
var _ObjectExpression = DefineNode({type: "ObjectExpression", properties: []}, Expression);

var Property = DefineNode({type: "Property", key: ["Literal" , "Identifier"], value: "Expression", kind: ["init" , "get" , "set"]}, Node);
var _Property = DefineNode({type: "Property", key: undefined, value: undefined, kind: undefined}, Node);

var FunctionExpression = DefineNode({type: "FunctionExpression"}, Function, Expression);
var _FunctionExpression = DefineNode({type: "FunctionExpression", id: undefined, expression: false, generator:false,async:false,params:[],min:-1,max:-1, body:undefined}, Function, Expression);

var UnaryExpression = DefineNode({type: "UnaryExpression", operator: "UnaryOperator", prefix: "Boolean", argument: "Expression"}, Expression);
var _UnaryExpression = DefineNode({type: "UnaryExpression", operator: undefined, prefix: undefined, argument: undefined}, Expression);

var UpdateExpression = DefineNode({type: "UpdateExpression", operator: "UpdateOperator", argument: "Expression", prefix: "Boolean"}, Expression);
var _UpdateExpression = DefineNode({type: "UpdateExpression", operator: undefined, argument: undefined, prefix: undefined}, Expression);

var BinaryExpression = DefineNode({type: "BinaryExpression", operator: "BinaryOperator", left: "Expression", right: "Expression"}, Expression);
var _BinaryExpression = DefineNode({type: "BinaryExpression", operator: undefined, left: undefined, right: undefined}, Expression);

var AssignmentExpression = DefineNode({type: "AssignmentExpression", operator: "AssignmentOperator", left: ["Pattern" , "Expression"], right: "Expression"}, Expression);
var _AssignmentExpression = DefineNode({type: "AssignmentExpression", operator: undefined, left: undefined, right: undefined}, Expression);

var LogicalExpression = DefineNode({type: "LogicalExpression", operator: "LogicalOperator", left: "Expression", right: "Expression"}, Expression);
var _LogicalExpression = DefineNode({type: "LogicalExpression", operator: undefined, left: undefined, right: undefined}, Expression);


var MemberExpression = DefineNode({type: "MemberExpression", object: "Expression", property: ["Expression", "Identifier"], computed: "Boolean"}, Expression, Pattern);
var _MemberExpression = DefineNode({type: "MemberExpression", object: undefined, property: undefined, computed: true}, Expression, Pattern);
  LogicalExpression
var ConditionalExpression = DefineNode({type: "ConditionalExpression", test: "Expression", alternate: "Expression", consequent: "Expression"}, Expression);
var _ConditionalExpression = DefineNode({type: "ConditionalExpression", test: undefined, alternate: undefined, consequent: undefined}, Expression);

var CallExpression = DefineNode({type: "CallExpression", callee: "Expression", arguments: [ ["Expression"] ]}, Expression);
var _CallExpression = DefineNode({type: "CallExpression", callee: undefined, arguments: []}, Expression);

var NewExpression = DefineNode({type: "NewExpression", callee: "Expression", arguments: [ ["Expression"] ]}, Expression);
var _NewExpression = DefineNode({type: "NewExpression", callee: undefined, arguments: []}, Expression);

//var SequenceExpression = DefineNode({type: "SequenceExpression", expressions: [ ["Expression"] ]}, Expression);
//var _SequenceExpression = DefineNode({type: "SequenceExpression", expressions: []}, Expression);




// es5
var es5 = { 
  Node: Node,
  Program: Program,
  Statement: Statement,
  Expression: Expression,
  Pattern: Pattern,
  Declaration: Declaration,
  Identifier: Identifier,
  Literal: Literal,
//  RegExpLiteral: RegExpLiteral,
  Function: Function,
  ExpressionStatement: ExpressionStatement,
  Directive: Directive,
  BlockStatement: BlockStatement,
  FunctionBody: FunctionBody,
  EmptyStatement: EmptyStatement,
  DebuggerStatement: DebuggerStatement,
  WithStatement: WithStatement,
  ReturnStatement: ReturnStatement,
  LabeledStatement: LabeledStatement,
  BreakStatement: BreakStatement,
  ContinueStatement: ContinueStatement,
  IfStatement: IfStatement,
  SwitchStatement: SwitchStatement,
  SwitchCase: SwitchCase,
  ThrowStatement: ThrowStatement,
  TryStatement: TryStatement,
  CatchClause: CatchClause,
  WhileStatement: WhileStatement,
  DoWhileStatement: DoWhileStatement,
  ForStatement: ForStatement,
  ForInStatement: ForInStatement,
  FunctionDeclaration: FunctionDeclaration,
  VariableDeclaration: VariableDeclaration,
  VariableDeclarator: VariableDeclarator,
  ThisExpression: ThisExpression,
  ArrayExpression: ArrayExpression,
  ObjectExpression: ObjectExpression,
  Property: Property,
  FunctionExpression: FunctionExpression,
  UnaryExpression: UnaryExpression,
  UpdateExpression: UpdateExpression,
  BinaryExpression: BinaryExpression,
  AssignmentExpression: AssignmentExpression,
  LogicalExpression: LogicalExpression,
  MemberExpression: MemberExpression,
  ConditionalExpression: ConditionalExpression,
  CallExpression: CallExpression,
  NewExpression: NewExpression,
  //SequenceExpression: SequenceExpression,
  UnaryOperator: UnaryOperator,
  UpdateOperator: UpdateOperator,
  BinaryOperator: BinaryOperator,
  AssignmentOperator: AssignmentOperator,
  LogicalOperator: LogicalOperator
}

var Statements = [];
var Expressions = [];
var Declarations = [];
var Patterns = [];
var Others = [];
var ControlFlows = ["ReturnStatement", "LabeledStatement", "BreakStatement", "ContinueStatement"]; 
var Choices = ["IfStatement", "SwitchStatement"];
var Exceptions = ["ThrowStatement", "TryStatement"];
var Loops = ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement"];

for(var i of Object.keys(es5)) { 
  if (!('parents' in es5[i]) ) {
    continue; 
  }
  let pushed = false;

  if(es5[i].parents.includes('Declaration')) {
    Declarations.push(i); 
    pushed = true;
  }  
  if(es5[i].parents.includes('Statement')) { 
    Statements.push(i);
    pushed = true;
  } 
  if(es5[i].parents.includes('Expression')) { 
    Expressions.push(i);
    pushed = true;
  }
  if(es5[i].parents.includes('Pattern')) { 
    Patterns.push(i);
    pushed = true;
  }  
  if (!pushed) {
    Others.push(i);
  }  
}


es5.Statements = Statements;
es5.Expressions = Expressions;
es5.Declarations = Declarations;
es5.Patterns = Patterns;
es5.Others = Others;
es5.ControlFlows = ControlFlows;
es5.Choices = Choices;
es5.Exceptions = Exceptions;
es5.Loops = Loops;

module.exports.es5 = es5;

//// es2015 == es6

// Functions
var Function = RedefineNode(Function);
Function.generator = "Boolean";

// Statements
var ForOfStatement = DefineNode({type: "ForOfStatement"}, ForInStatement);
var _ForOfStatement = DefineNode({type: "ForOfStatement",left: undefined, right: undefined, body: undefined}, ForInStatement);

// Declarations
var VariableDeclaration = RedefineNode(VariableDeclaration);
VariableDeclaration.kind = ["var", "let", "const"];
var _VariableDeclaration = RedefineNode(_VariableDeclaration);
_VariableDeclaration.kind = undefined;

// Expressions
var Super = DefineNode({type: "Super"}, Node);
var _Super = DefineNode({type: "Super"}, Node);
var CallExpression = RedefineNode(CallExpression);
CallExpression.callee = ["Expression", "Super"];
var _CallExpression = RedefineNode(_CallExpression);
_CallExpression.callee = undefined;


var MemberExpression = RedefineNode(MemberExpression);
MemberExpression.object = ["Expression", "Super"];
var _MemberExpression = RedefineNode(_MemberExpression);
_MemberExpression.object = undefined;

var SpreadElement = DefineNode({type: "SpreadElement", argument: "Expression"}, Node);
var _SpreadElement = DefineNode({type: "SpreadElement", argument: "Expression"}, Node);
var ArrayExpression = RedefineNode(ArrayExpression);
ArrayExpression.elements = [ ["Expression", "SpreadElement", "null"] ];
var _ArrayExpression = RedefineNode(_ArrayExpression);
_ArrayExpression.elements = [  ];
var CallExpression = RedefineNode(CallExpression);
CallExpression.arguments = [ ["Expression", "SpreadElement"] ];
var _CallExpression = RedefineNode(_CallExpression);
_CallExpression.arguments = [  ];
var NewExpression = RedefineNode(NewExpression);
NewExpression.arguments = [ ["Expression", "SpreadElement"] ];
var _NewExpression = RedefineNode(_NewExpression);
_NewExpression.arguments = [  ];
var AssignmentExpression = RedefineNode(AssignmentExpression);
AssignmentExpression.left = "Pattern";
var _AssignmentExpression = RedefineNode(_AssignmentExpression);
_AssignmentExpression.left = "Pattern";

var Property = RedefineNode(Property);
Property.key = "Expression";
Property.method = "Boolean";
Property.shorthand = "Boolean";
Property.computed = "Boolean";
var _Property = RedefineNode(_Property);
_Property.key = undefined;
_Property.method = false;
_Property.shorthand = false;
_Property.computed = false;

var ArrowFunctionExpression = DefineNode({type: "ArrowFunctionExpression", body: ["FunctionBody", "Expression"], expression: "Boolean"}, Function, Expression);
var _ArrowFunctionExpression = DefineNode({type: "ArrowFunctionExpression", expression: false, generator:false,async:false,params:[],min:-1,max:-1,body:undefined}, Function, Expression);
var YieldExpression = DefineNode({type: "YieldExpression", argument: ["Expression", "null"], delegate: "Boolean"}, Expression);
var _YieldExpression = DefineNode({type: "YieldExpression", argument: undefined, delegate: undefined}, Expression);

// Template Literals
var TemplateElement = DefineNode({type: "TemplateElement", tail: "Boolean", value: {cooked: "String", raw: "String" }}, Node);
var _TemplateElement = DefineNode({type: "TemplateElement", tail: undefined, value: {cooked: undefined, raw: undefined }}, Node);
var TemplateLiteral = DefineNode({type: "TemplateLiteral", quasis: [[ "TemplateElement" ]], expressions: [[ "Expression" ]]}, Expression);
var _TemplateLiteral = DefineNode({type: "TemplateLiteral", quasis: [], expressions: []}, Expression);
var TaggedTemplateExpression = DefineNode({type: "TaggedTemplateExpression", tag: "Expression", quasi: "TemplateLiteral"}, Expression);
var _TaggedTemplateExpression = DefineNode({type: "TaggedTemplateExpression", tag: undefined, quasi: undefined}, Expression);

// Patterns
var AssignmentProperty = DefineNode({type: "AssignmentProperty", value: "Pattern", kind: "init", method: "false"}, Property);
var _AssignmentProperty = DefineNode({type: "AssignmentProperty", key:undefined, value: undefined, kind: undefined, method: undefined}, Property);
var ObjectPattern = DefineNode({type: "ObjectPattern", properties: [[ "AssignmentProperty" ]]}, Pattern);
var _ObjectPattern = DefineNode({type: "ObjectPattern", properties: []}, Pattern);
var ArrayPattern = DefineNode({type: "ArrayPattern", elements: [[ "Pattern", "null" ]]}, Pattern);
var _ArrayPattern = DefineNode({type: "ArrayPattern", elements: []}, Pattern);
var RestElement = DefineNode({type: "RestElement", argument: "Pattern"}, Pattern);
var _RestElement = DefineNode({type: "RestElement", argument: undefined}, Pattern);
var AssignmentPattern = DefineNode({type: "AssignmentPattern", left: "Pattern", right: "Expression"}, Pattern);
var _AssignmentPattern = DefineNode({type: "AssignmentPattern", left: undefined, right: undefined}, Pattern);

// Classes
var ClassBody = DefineNode({type: "ClassBody", body: [[ "MethodDefinition" ]]}, Node);
var _ClassBody = DefineNode({type: "ClassBody", body: []}, Node);
var Class = DefineNode({type: "Class", id: ["Identifier", "null"], superClass: ["Expression", "null"], body: "ClassBody"}, Node);
var _Class = DefineNode({type: "Class", id: undefined, superClass: undefined, body: undefined}, Node);
var MethodDefinition = DefineNode({type: "MethodDefinition", key: "Expression", value: "FunctionExpression", kind: ["constructor", "method", "get", "set"], computed: "Boolean", static: "Boolean"}, Node);
var _MethodDefinition = DefineNode({type: "MethodDefinition", key: undefined, value: undefined, kind: undefined, computed: undefined, static: undefined}, Node);
var ClassDeclaration = DefineNode({type: "ClassDeclaration", id: "Identifier"}, Class, Declaration);
var _ClassDeclaration = DefineNode({type: "ClassDeclaration", id: undefined}, Class, Declaration);
var ClassExpression = DefineNode({type: "ClassExpression"}, Class, Expression);
var _ClassExpression = DefineNode({type: "ClassExpression"}, Class, Expression);
var MetaProperty = DefineNode({type: "MetaProperty", meta: "Identifier", property: "Identifier"}, Expression);
var _MetaProperty = DefineNode({type: "MetaProperty", meta: undefined, property: undefined}, Expression);

var es6 = { 
  Node: Node,
  Program: Program,
  Statement: Statement,
  Expression: Expression,
  Pattern: Pattern,
  Declaration: Declaration,
  Identifier: Identifier,
  Literal: Literal,
//  RegExpLiteral: RegExpLiteral,
  Function: Function,
  ExpressionStatement: ExpressionStatement,
  Directive: Directive,
  BlockStatement: BlockStatement,
  FunctionBody: FunctionBody,
  EmptyStatement: EmptyStatement,
  DebuggerStatement: DebuggerStatement,
  WithStatement: WithStatement,
  ReturnStatement: ReturnStatement,
  LabeledStatement: LabeledStatement,
  BreakStatement: BreakStatement,
  ContinueStatement: ContinueStatement,
  IfStatement: IfStatement,
  SwitchStatement: SwitchStatement,
  SwitchCase: SwitchCase,
  ThrowStatement: ThrowStatement,
  TryStatement: TryStatement,
  CatchClause: CatchClause,
  WhileStatement: WhileStatement,
  DoWhileStatement: DoWhileStatement,
  ForStatement: ForStatement,
  ForInStatement: ForInStatement,
  FunctionDeclaration: FunctionDeclaration,
  VariableDeclaration: VariableDeclaration,
  VariableDeclarator: VariableDeclarator,
  ThisExpression: ThisExpression,
  ArrayExpression: ArrayExpression,
  ObjectExpression: ObjectExpression,
  Property: Property,
  FunctionExpression: FunctionExpression,
  UnaryExpression: UnaryExpression,
  UpdateExpression: UpdateExpression,
  BinaryExpression: BinaryExpression,
  AssignmentExpression: AssignmentExpression,
  LogicalExpression: LogicalExpression,
  MemberExpression: MemberExpression,
  ConditionalExpression: ConditionalExpression,
  CallExpression: CallExpression,
  NewExpression: NewExpression,
  //SequenceExpression: SequenceExpression,
  //operator
  MathUnaryOperator: MathUnaryOperator,
  EffectMathUnaryOperator: EffectMathUnaryOperator,
  CommonUnaryOperator:CommonUnaryOperator,
  UnaryOperator:UnaryOperator,
  UpdateOperator: UpdateOperator,
  BinaryOperator: BinaryOperator,
  BigIntBinaryOperator:BigIntBinaryOperator,
  ComparisonOperator:ComparisonOperator,
  EqualityOperator:EqualityOperator,
  AssignmentOperator: AssignmentOperator,
  LogicalOperator: LogicalOperator,

  // es5 creator
  _Node: _Node,
  _Program: _Program,
  _Statement: _Statement,
  _Expression: _Expression,
  _Pattern: _Pattern,
  _Declaration: _Declaration,
  _Identifier: _Identifier,
  _Literal: _Literal,
  _Function: _Function,
  _ExpressionStatement: _ExpressionStatement,
  _Directive: _Directive,
  _BlockStatement: _BlockStatement,
  _FunctionBody: _FunctionBody,
  _EmptyStatement: _EmptyStatement,
  _DebuggerStatement: _DebuggerStatement,
  _WithStatement: _WithStatement,
  _ReturnStatement: _ReturnStatement,
  _LabeledStatement: _LabeledStatement,
  _BreakStatement: _BreakStatement,
  _ContinueStatement: _ContinueStatement,
  _IfStatement: _IfStatement,
  _SwitchStatement: _SwitchStatement,
  _SwitchCase: _SwitchCase,
  _ThrowStatement: _ThrowStatement,
  _TryStatement: _TryStatement,
  _CatchClause: _CatchClause,
  _WhileStatement: _WhileStatement,
  _DoWhileStatement: _DoWhileStatement,
  _ForStatement: _ForStatement,
  _ForInStatement: _ForInStatement,
  _FunctionDeclaration: _FunctionDeclaration,
  _VariableDeclaration: _VariableDeclaration,
  _VariableDeclarator: _VariableDeclarator,
  _ThisExpression: _ThisExpression,
  _ArrayExpression: _ArrayExpression,
  _ObjectExpression: _ObjectExpression,
  _Property: _Property,
  _FunctionExpression: _FunctionExpression,
  _UnaryExpression: _UnaryExpression,
  _UpdateExpression: _UpdateExpression,
  _BinaryExpression: _BinaryExpression,
  _AssignmentExpression: _AssignmentExpression,
  _LogicalExpression: _LogicalExpression,
  _MemberExpression: _MemberExpression,
  _ConditionalExpression: _ConditionalExpression,
  _CallExpression: _CallExpression,
  _NewExpression: _NewExpression,
  //_SequenceExpression: _SequenceExpression,
  ////////////////////////////////////////////
  ///////////es 6 /////////////////////////

  ForOfStatement: ForOfStatement,
  Super: Super,
  SpreadElement: SpreadElement,
  ArrowFunctionExpression: ArrowFunctionExpression,
  YieldExpression: YieldExpression,
  TemplateLiteral: TemplateLiteral,
  TaggedTemplateExpression: TaggedTemplateExpression,
  TemplateElement: TemplateElement,
  AssignmentProperty: AssignmentProperty,
  ObjectPattern: ObjectPattern,
  ArrayPattern: ArrayPattern,
  RestElement: RestElement,
  AssignmentPattern: AssignmentPattern,
  Class: Class,
  ClassBody: ClassBody,
  MethodDefinition: MethodDefinition,
  ClassDeclaration: ClassDeclaration,
  ClassExpression: ClassExpression,
  MetaProperty: MetaProperty,
  //es6 creator
  _ForOfStatement: _ForOfStatement,
  _Super: _Super,
  _SpreadElement: _SpreadElement,
  _ArrowFunctionExpression: _ArrowFunctionExpression,
  _YieldExpression: _YieldExpression,
  _TemplateLiteral: _TemplateLiteral,
  _TaggedTemplateExpression: _TaggedTemplateExpression,
  _TemplateElement: _TemplateElement,
  _AssignmentProperty: _AssignmentProperty,
  _ObjectPattern: _ObjectPattern,
  _ArrayPattern: _ArrayPattern,
  _RestElement: _RestElement,
  _AssignmentPattern: _AssignmentPattern,
  _Class: _Class,
  _ClassBody: _ClassBody,
  _MethodDefinition: _MethodDefinition,
  _ClassDeclaration: _ClassDeclaration,
  _ClassExpression: _ClassExpression,
  _MetaProperty: _MetaProperty
}


var DontUse = ["ForInStatement", "ForOfStatement"];
var Statements = [];

var Expressions = [];
var EffectExpressions = ["MemberExpression","CallExpression","NewExpression"];
var PreEffectExpressions = ["UnaryExpression","UpdateExpression","BinaryExpression"];
var NonEffectExpressions = [];
var PreNonEffectExpressions = [];

var Declarations = ["VariableDeclarator"];
var Functions  = [];
var FunctionExpressions =[];
var FunctionCalls = ["CallExpression", "NewExpression"];
var Patterns = [];
var Others = [];
var ControlFlows = ["ReturnStatement", "LabeledStatement", "BreakStatement", "ContinueStatement"]; 
var Choices = ["IfStatement", "SwitchStatement", "SwitchCase"];
var Exceptions = ["ThrowStatement", "TryStatement", "CatchClause"];
//var Loops = ["WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement"];
var Loops = ["WhileStatement", "DoWhileStatement", "ForStatement"];
var ScopeCreators = ["ForStatement", "ForInStatement", "ForOfStatement"];
var OutNodes = ["ReturnStatement","BlockStatements","Property"];


var ProhibitedExpressions = ["MetaProperty", "RegExpLiteral", "YieldExpression", "ClassExpression", "UpdateExpression", "MemberExpression"];
//(TODO
ProhibitedExpressions = ProhibitedExpressions.concat(["ArrowFunctionExpression","NewExpression","CallExpression", "ThisExpression",
   "AssignmentExpression","TemplateLiteral", "LogicalExpression","ConditionalExpression", "TaggedTemplateExpression"]);

var TestAllowed = ["Identifier","Literal","ArrayExpression", "ObjectExpression", "Literal","FunctionExpression","TaggedTemplateExpression","BinaryExpression", "UnaryExpression"];


for(var i of Object.keys(es6)) { 
  if (!("parents" in es6[i]) || i.includes("_") || DontUse.includes(i)) {
    continue; 
  }

  let pushed = false;
  if(es6[i].parents.includes('Function')) {
    Functions.push(i);
    ScopeCreators.push(i);
    pushed = true;
  }

  if(es6[i].parents.includes('Function') && !es6[i].parents.includes('Statement')) {
    FunctionExpressions.push(i);
    pushed = true;
  }

  if(es6[i].parents.includes('Declaration')) {
    Declarations.push(i);
    pushed = true;
  }

  if(es6[i].parents.includes('Statement') && !["Declaration", "FunctionBody", "DebuggerStatement", "WithStatement"].includes(i) && !ControlFlows.includes(i)) {
    Statements.push(i);
    pushed = true;
  }

  //if(es6[i].parents.includes('Expression') && TestAllowed.includes(i) )   {
  if(es6[i].parents.includes('Expression') && !ProhibitedExpressions.includes(i))   {
    Expressions.push(i);
    pushed = true;
  }

  if(es6[i].parents.includes('Expression') && !ProhibitedExpressions.includes(i) && !EffectExpressions.includes(i) ) {
    PreNonEffectExpressions.push(i);
  }

  //if(es6[i].parents.includes('Expression') && TestAllowed.includes(i) && !ProhibitedExpressions.includes(i) && !EffectExpressions.includes(i)  && !PreEffectExpressions.includes(i) ) {
  if(es6[i].parents.includes('Expression') && !ProhibitedExpressions.includes(i) && !EffectExpressions.includes(i)  && !PreEffectExpressions.includes(i) ) {
    NonEffectExpressions.push(i);
  }


  // Type out nodes.
  if(es6[i].parents.includes('Expression') || OutNodes.includes(i) && !["MetaProperty", "RegExpLiteral", "YieldExpression", "ClassExpression"].includes(i)) {
    es6["_" + i].outType = undefined;
    es6["_" + i].useNode = null;
  }

  if(es6[i].parents.includes('Pattern')) { 
    Patterns.push("_" + i);
    pushed = true;
  }  
  if (!pushed) {
    Others.push(i);
  }  
}


es6.Statements = Statements;
es6.Expressions = Expressions;
es6.NonEffectExpressions = NonEffectExpressions;
es6.Declarations = Declarations;
es6.Functions = Functions;
es6.Patterns = Patterns;
es6.Others = Others;
es6.ControlFlows = ControlFlows;
es6.Choices = Choices;
es6.Exceptions = Exceptions;
es6.Loops = Loops;
es6.ScopeCreators = ScopeCreators;
es6.FunctionExpressions = FunctionExpressions;
es6.FunctionCalls = FunctionCalls;
es6.OutStatements = OutNodes;

//general setting
{


  for (let i = 0; i < 5; i++) {
    //es6.Expressions.push("Identifier");
    //es6.Expressions.push("Literal");
    //es6.Expressions.push("ArrayExpression");
    es6.Expressions.push("FunctionExpression");
    //es6.Expressions.push("TaggedTemplateExpression");
  }


  util.removeFromArray(es6.Expressions, ["ClassExpression"]);
  util.removeFromArray(es6.Statements, ["EmptyStatement", "ClassDeclaration"]);
}

var SingleStatements = es6.Statements.slice();
var LoopStatements = es6.Statements.slice();
var LValueExpressions = ["MemberExpression", "Identifier"];
var RValueExpressions = es6.Expressions.slice();
var ForExpressions = es6.Expressions.slice();

util.removeFrom(SingleStatements,"VariableDeclaration");
util.removeFrom(LoopStatements,"VariableDeclaration","FunctionDeclaration");
util.removeFrom(RValueExpressions,"AssignmentExpression");
util.removeFrom(ForExpressions,"AssignmentExpression");

es6.Patterns = ["Identifier", "Literal"]

var createNode = (name) => {
  let obj = util.deepCopy(es6["_" + name])

  delete obj.parentsRef;
  delete obj.parents;
  obj.effect = false;
  //(DEBUG_CHECK
  if(debug) {
    obj = util.getDebugProxy(obj);
  }
  //)DEBUG_CHECK
  return obj;
};

var createNodePair = (boxed, origin) => {
    let pair = {boxed:boxed,origin:origin};
    //(DEBUG_CHECK
    if(debug)
      pair = util.getDebugProxy(pair);
    //)DEBUG_CHECK
    return pair;
};

var getFunctionOf = (name, funcName) => {
  if(funcName)
    return funcName
  let pop = util.chooseRandom(es6[name])
  if(!pop)
    throw new util.DebugError("invailid getFunctionOf argument:" + name);
  return pop;
};

es6.SingleStatements = SingleStatements;
es6.LoopStatements = LoopStatements;
es6.LValueExpressions = LValueExpressions;
es6.RValueExpressions = RValueExpressions;
es6.ForExpressions = ForExpressions;

es6.createNode = createNode;
es6.createNodePair = createNodePair;
es6.getFunctionOf = getFunctionOf;


module.exports = {
  es6 : es6,
}