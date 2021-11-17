


function FDescInit(runtime) {
    runtime.addFDesc("Array", {min: 0, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 1}]});
    runtime.addFDesc("Array.from", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Array", "o": 0, "u": 0}, {"k": "Function", "o": 1, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    }); // arrayLike => Array
    runtime.addFDesc("Array.isArray",   {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Array.of", {min: 1, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 1}]});
    runtime.addFDesc("Array.prototype.concat", {min: 0, max: Infinity, needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 1}]});
    runtime.addFDesc("Array.prototype.copyWithin", {
        min: 1,
        max: 3,
        needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.entries", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Array.prototype.every", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.fill", {
        min: 1,
        max: 3,
        needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.filter", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.find", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.findIndex", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.flat", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 0}]});
    runtime.addFDesc("Array.prototype.flatMap", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.forEach", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.includes", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.indexOf", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.join", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 1, "u": 0}]});
    runtime.addFDesc("Array.prototype.keys", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Array.prototype.lastIndexOf", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.map", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.pop", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Array.prototype.push", {min: 1, max: Infinity, needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 1}]});
    runtime.addFDesc("Array.prototype.reduce", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Anything", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.reduceRight", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Anything", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.reverse", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Array.prototype.shift", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Array.prototype.slice", {
        min: 0,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.some", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.sort", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "Function", "o": 1, "u": 0}]});
    runtime.addFDesc("Array.prototype.splice", {
        min: 1,
        max: Infinity,
        needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}, {"k": "Anything", "o": 1, "u": 1}]
    });
    runtime.addFDesc("Array.prototype.toLocaleString", {
        min: 0,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Array.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Array.prototype.unshift", {min: 1, max: Infinity, needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 1}]});
    runtime.addFDesc("Array.prototype.values", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Boolean", {min: 0, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 0}]});
    runtime.addFDesc("Boolean.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Boolean.prototype.valueOf", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Function", {
        min: 1,
        max: Infinity,
        needThis:false, forbidden:true , argv: [{"k": "Argument", "o": 1, "u": 1}, {"k": "Code", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Function.prototype", {
        min: 1,
        max: Infinity,
        needThis:false, forbidden:true , argv: [{"k": "Argument", "o": 1, "u": 1}, {"k": "Code", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Function.prototype.apply", {
        min: 1,
        max: 2,
        needThis:false, forbidden:true , argv: [{"k": "Identifier", "o": 0, "u": 0}, {"k": "Array", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Function.prototype.bind", {
        min: 1,
        max: Infinity,
        needThis:false, forbidden:false , argv: [{"k": "Identifier", "o": 0, "u": 0}, {"k": "Argument", "o": 1, "u": 1}]
    });
    runtime.addFDesc("Function.prototype.call", {
        min: 1,
        max: Infinity,
        needThis:true, forbidden:false , argv: [{"k": "Identifier", "o": 0, "u": 0}, {"k": "Argument", "o": 1, "u": 1}]
    });
    runtime.addFDesc("Function.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("JSON.parse", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Function", "o": 1, "u": 0}]
    });
    runtime.addFDesc("JSON.stringify", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Function|Array", "o": 1, "u": 0}, {
            "k": "String",
            "o": 1,
            "u": 0
        }]
    });
    runtime.addFDesc("Map", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "iterable", "o": 1, "u": 0}]});
    runtime.addFDesc("Map.prototype.clear", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Map.prototype.entries", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Map.prototype.forEach", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Map.prototype.get", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Map.prototype.has", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Map.prototype.keys", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Map.prototype.set", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Anything", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Map.prototype.values", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Math.abs", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.acos", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.acosh", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.asin", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.asinh", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.atan", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.atan2", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Math.atanh", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.cbrt", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.ceil", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.clz32", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.cos", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.cosh", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.exp", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.expm1", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.floor", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.fround", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.hypot", {min: 0, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 1, "u": 1}]});
    runtime.addFDesc("Math.imul", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Math.log", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.log10", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.log1p", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.log2", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.max", {min: 0, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 1, "u": 1}]});
    runtime.addFDesc("Math.min", {min: 0, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 1, "u": 1}]});
    runtime.addFDesc("Math.pow", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Math.random", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Math.round", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.sign", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.sin", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.sinh", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.sqrt", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.tan", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.tanh", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Math.trunc", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Number", {min: 1, max: 1, needThis:false, forbidden:true , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Number.isFinite", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Number.isInteger", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Number.isNaN", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Number.isSafeInteger", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Number.parseFloat", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Number.parseInt", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Number.prototype.toExponential", {min: 0, max: 1, needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 0}]});
    runtime.addFDesc("Number.prototype.toFixed", {min: 0, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 1, "u": 0}]});
    runtime.addFDesc("Number.prototype.toLocaleString", {
        min: 0,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Number.prototype.toPrecision", {min: 0, max: 1, needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 0}]});
    runtime.addFDesc("Number.prototype.toString", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "Number", "o": 1, "u": 0}]});
    runtime.addFDesc("Number.prototype.valueOf", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
//runtime.addFDesc("Number.toInteger", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Object", {min: 0, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 0}]});
    runtime.addFDesc("Object.assign", {
        min: 2,
        max: Infinity,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "Object", "o": 0, "u": 1}]
    });
    runtime.addFDesc("Object.create", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "prototype", "o": 0, "u": 0}, {"k": "propertiesObject", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Object.defineProperties", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "propertiesObject", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Object.defineProperty", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}, {
            "k": "propertiesObject",
            "o": 0,
            "u": 0
        }]
    });
    runtime.addFDesc("Object.entries", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.freeze", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.fromEntries", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "iterable", "o": 0, "u": 0}]});
// runtime.addFDesc("Object.getNotifier", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.getOwnPropertyDescriptor", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "propertiesObject", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Object.getOwnPropertyDescriptors", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.getOwnPropertyNames", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.getOwnPropertySymbols", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.getPrototypeOf", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.is", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "Object", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Object.isExtensible", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.isFrozen", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.isSealed", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.keys", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
// runtime.addFDesc("Object.observe", {min: 2, max: 3, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "Function", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.preventExtensions", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.prototype.__defineGetter__", {
        min: 2,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Function", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Object.prototype.__defineSetter__", {
        min: 2,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Function", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Object.prototype.__lookupGetter__", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.prototype.__lookupSetter__", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.prototype.hasOwnProperty", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.prototype.isPrototypeOf", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.prototype.propertyIsEnumerable", {
        min: 1,
        max: 1,
        needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Object.prototype.toLocaleString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Object.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Object.prototype.valueOf", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Object.seal", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Object.setPrototypeOf", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "prototype", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Object.values", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("RegExp", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "flags", "o": 1, "u": 0}]
    });
    runtime.addFDesc("RegExp.prototype.compile", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "flags", "o": 0, "u": 0}]
    });
    runtime.addFDesc("RegExp.prototype.exec", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("RegExp.prototype.test", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("RegExp.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Set", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "iterable", "o": 1, "u": 0}]});
    runtime.addFDesc("Set.prototype.add", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Set.prototype.clear", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Set.prototype.delete", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Set.prototype.entries", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Set.prototype.forEach", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Set.prototype.has", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Set.prototype.values", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("String", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("String.fromCharCode", {min: 1, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 1}]});
    runtime.addFDesc("String.fromCodePoint", {min: 1, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 1}]});
    runtime.addFDesc("String.prototype.anchor", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.big", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.blink", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.bold", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.charAt", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.charCodeAt", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.codePointAt", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.concat", {min: 1, max: Infinity, needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 1}]});
    runtime.addFDesc("String.prototype.endsWith", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.fixed", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.fontcolor", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.fontsize", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.includes", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.indexOf", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.italics", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.lastIndexOf", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.link", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.localeCompare", {
        min: 1,
        max: 3,
        needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.match", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "RegExp", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.normalize", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 1, "u": 0}]});
    runtime.addFDesc("String.prototype.padEnd", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "String", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.padStart", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "String", "o": 1, "u": 0}]
    });
// runtime.addFDesc("String.prototype.quote", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.repeat", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.replace", {
        min: 2,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "RegExp", "o": 0, "u": 0}, {"k": "Function", "o": 0, "u": 0}]
    });
    runtime.addFDesc("String.prototype.search", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("String.prototype.slice", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.small", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.split", {
        min: 0,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "String|RegExp", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.startsWith", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.strike", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.sub", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.substr", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.substring", {
        min: 1,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("String.prototype.sup", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.toLocaleLowerCase", {
        min: 0,
        max: Infinity,
        needThis:true, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 1}]
    });
    runtime.addFDesc("String.prototype.toLocaleUpperCase", {
        min: 0,
        max: Infinity,
        needThis:true, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 1}]
    });
    runtime.addFDesc("String.prototype.toLowerCase", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.toUpperCase", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.trim", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.trimEnd", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.trimStart", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.prototype.valueOf", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("String.raw", {min: 0, max: Infinity, needThis:false, forbidden:true , argv: [{"k": "Anything", "o": 1, "u": 1}]});
    runtime.addFDesc("Symbol", {min: 0, max: 1, needThis:false, forbidden:true , argv: [{"k": "String", "o": 1, "u": 0}]});
    runtime.addFDesc("Symbol.for", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Symbol.keyFor", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Symbol.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Symbol.prototype.valueOf", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("WeakMap", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "iterable", "o": 1, "u": 0}]});
// runtime.addFDesc("WeakMap.prototype.clear", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("WeakMap.prototype.delete", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("WeakMap.prototype.get", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("WeakMap.prototype.has", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("WeakMap.prototype.set", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Anything", "o": 0, "u": 0}]
    });
    runtime.addFDesc("WeakSet", {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "iterable", "o": 1, "u": 0}]});
    runtime.addFDesc("WeakSet.prototype.add", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
// runtime.addFDesc("WeakSet.prototype.clear", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("WeakSet.prototype.delete", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("WeakSet.prototype.has", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});

    runtime.addFDesc("ArrayBuffer", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("ArrayBuffer.isView", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("ArrayBuffer.prototype.slice", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
//runtime.addFDesc("ArrayBuffer.transfer", {min: 1, max: 2, needThis:false, forbidden:false , argv: [{"k": "ArrayBuffer", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}]});
//runtime.addFDesc("AsyncFunction", {min: 1, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Argument", "o": 1, "u": 1}, {"k": "Code", "o": 0, "u": 0}]});
    runtime.addFDesc("Atomics.add", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.and", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.compareExchange", {
        min: 4,
        max: 4,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {
            "k": "Number",
            "o": 0,
            "u": 0
        }, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.exchange", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.isLockFree", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Atomics.load", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.notify", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.or", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.store", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.sub", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.wait", {
        min: 3,
        max: 4,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Atomics.xor", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "TypedArray", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView", {
        min: 1,
        max: 3,
        needThis:true, forbidden:false , argv: [{"k": "ArrayBuffer", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.getFloat32", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Boolean", "o": 1, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.getFloat64", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Boolean", "o": 1, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.getInt16", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Boolean", "o": 1, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.getInt32", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Boolean", "o": 1, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.getInt8", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("DataView.prototype.getUint16", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Boolean", "o": 1, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.getUint32", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Boolean", "o": 1, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.getUint8", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("DataView.prototype.setFloat32", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.setFloat64", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.setInt16", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.setInt32", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.setInt8", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.setUint16", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.setUint32", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("DataView.prototype.setUint8", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Date", {
        min: 0,
        max: 7,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {
            "k": "Number",
            "o": 1,
            "u": 0
        }, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.UTC", {
        min: 1,
        max: 7,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {
            "k": "Number",
            "o": 1,
            "u": 0
        }, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {
            "k": "Number",
            "o": 1,
            "u": 0
        }, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.now", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.parse", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Date.prototype.getDate", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getDay", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getFullYear", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getHours", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getMilliseconds", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getMinutes", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getMonth", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getSeconds", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getTime", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getTimezoneOffset", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCDate", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCDay", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCFullYear", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCHours", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCMilliseconds", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCMinutes", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCMonth", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getUTCSeconds", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.getYear", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.setDate", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Date.prototype.setFullYear", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setHours", {
        min: 1,
        max: 4,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {
            "k": "Number",
            "o": 1,
            "u": 0
        }, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setMilliseconds", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Date.prototype.setMinutes", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setMonth", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setSeconds", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setTime", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Date.prototype.setUTCDate", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Date.prototype.setUTCFullYear", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setUTCHours", {
        min: 1,
        max: 4,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {
            "k": "Number",
            "o": 1,
            "u": 0
        }, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setUTCMilliseconds", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Date.prototype.setUTCMinutes", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setUTCMonth", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setUTCSeconds", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}, {"k": "Number", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.setYear", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Date.prototype.toDateString", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.toGMTString", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.toISOString", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.toJSON", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.toLocaleDateString", {
        min: 0,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.toLocaleString", {
        min: 0,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.toLocaleTimeString", {
        min: 0,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Date.prototype.toString", {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.toTimeString", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.toUTCString", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Date.prototype.valueOf", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
// runtime.addFDesc("Generator.prototype.next", {min: 0, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 0}]});
// runtime.addFDesc("Generator.prototype.return", {min: 0, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 10, "u": 0}]});
// runtime.addFDesc("Generator.prototype.throw", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Error", "o": 0, "u": 0}]});
// runtime.addFDesc("GeneratorFunction", {min: 1, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Argument", "o": 1, "u": 1}, {"k": "Code", "o": 1, "u": 0}]});
    runtime.addFDesc("Intl.getCanonicalLocales", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "locales", "o": 0, "u": 0}]});
    runtime.addFDesc("Intl.Collator", {
        min: 0,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Intl.Collator.call", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Identifier", "o": 0, "u": 0}, {"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
// error // runtime.addFDesc("Intl.Collator.prototype.compare", {min: 2, max: 2, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Intl.Collator.prototype.resolvedOptions", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Intl.Collator.supportedLocalesOf", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 0, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Intl.DateTimeFormat", {
        min: 0,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Intl.DateTimeFormat.call", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Identifier", "o": 0, "u": 0}, {"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
// error // runtime.addFDesc("Intl.DateTimeFormat.prototype.format", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("Intl.DateTimeFormat.prototype.formatToParts", {
        min: 1,
        max: 1,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Intl.DateTimeFormat.prototype.resolvedOptions", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Intl.DateTimeFormat.supportedLocalesOf", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 0, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Intl.NumberFormat", {
        min: 0,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Intl.NumberFormat.call", {
        min: 1,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Identifier", "o": 0, "u": 0}, {"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
// error // runtime.addFDesc("Intl.NumberFormat.prototype.format", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Intl.NumberFormat.prototype.formatToParts", {
        min: 1,
        max: 1,
        needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Intl.NumberFormat.prototype.resolvedOptions", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Intl.NumberFormat.supportedLocalesOf", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 0, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Intl.PluralRules", {
        min: 0,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Intl.PluralRules.prototype.resolvedOptions", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
//runtime.addFDesc("Intl.PluralRules.select", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Number", "o": 0, "u": 0}]});
    runtime.addFDesc("Intl.PluralRules.supportedLocalesOf", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "locales", "o": 0, "u": 0}, {"k": "options", "o": 1, "u": 0}]
    });
//runtime.addFDesc("Intl.RelativeTimeFormat.prototype.resolvedOptions", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});
    runtime.addFDesc("Promise", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}]});
    runtime.addFDesc("Promise.all", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "iterable", "o": 0, "u": 0}]});
    runtime.addFDesc("Promise.prototype.catch", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}]});
    runtime.addFDesc("Promise.prototype.finally", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}]});
    runtime.addFDesc("Promise.prototype.then", {
        min: 1,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Function", "o": 1, "u": 0}]
    });
    runtime.addFDesc("Promise.race", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "iterable", "o": 0, "u": 0}]});
    runtime.addFDesc("Promise.reject", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Error", "o": 0, "u": 0}]});
    runtime.addFDesc("Promise.resolve", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("Proxy", {
        min: 2,
        max: 2,
        needThis:true, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "handler", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.apply", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "Identifier", "o": 0, "u": 0}, {"k": "Array", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.construct", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "Array", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.defineProperty", {
        min: 3,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}, {
            "k": "propertiesObject",
            "o": 0,
            "u": 0
        }]
    });
    runtime.addFDesc("Reflect.deleteProperty", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.get", {
        min: 2,
        max: 3,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.getOwnPropertyDescriptor", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.getPrototypeOf", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Reflect.has", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.isExtensible", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Reflect.ownKeys", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Reflect.preventExtensions", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("Reflect.set", {
        min: 3,
        max: 4,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "String", "o": 0, "u": 0}, {"k": "Anything", "o": 0, "u": 0}]
    });
    runtime.addFDesc("Reflect.setPrototypeOf", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}, {"k": "prototype", "o": 0, "u": 0}]
    });
    runtime.addFDesc("SharedArrayBuffer", {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("SharedArrayBuffer.prototype.slice", {
        min: 0,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
    });
    runtime.addFDesc("BigInt", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Integer", "o": 0, "u": 0}]});
    runtime.addFDesc("BigInt.asIntN", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0},{"k": "Integer", "o": 0, "u": 0}]});
    runtime.addFDesc("BigInt.asUintN ", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}]});
    runtime.addFDesc("BigInt.prototype.toString ", {min: 1, max: 1, needThis:true, forbidden:false , argv: []});
    runtime.addFDesc("BigInt.prototype.valueOf ", {min: 1, max: 1, needThis:true, forbidden:false , argv: []});


    runtime.addFDesc("escape", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    runtime.addFDesc("eval", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Code", "o": 0, "u": 0}]});
    runtime.addFDesc("isFinite", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("isNaN", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("parseFloat", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
    runtime.addFDesc("parseInt", {
        min: 2,
        max: 2,
        needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}, {"k": "Integer", "o": 0, "u": 0}]
    });
    runtime.addFDesc("unescape", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "String", "o": 0, "u": 0}]});
    // runtime.addFDesc("uneval", {min: 1, max: 1, needThis:false, forbidden:false , argv: [{"k": "Object", "o": 0, "u": 0}]});
    runtime.addFDesc("gc", {min: 0, max: 0, needThis:false, forbidden:false , argv: []});

    const Errors = ["Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"];
    const TypedArrays = ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array", "BigInt64Array", "BigUint64Array"];

    for (let e of Errors) {
        runtime.addFDesc(`${e}`, {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 1, "u": 0}]});
        runtime.addFDesc(`${e}.prototype.toString`, {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    }

    for (let t of TypedArrays) {
        runtime.addFDesc(`${t}`, {min: 1, max: 1, needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}]});
        runtime.addFDesc(`${t}.from`, {
            min: 1,
            max: 3,
            needThis:false, forbidden:false , argv: [{"k": "Array|ArrayBuffer", "o": 0, "u": 0}, {"k": "Function", "o": 1, "u": 0}, {
                "k": "Identifier",
                "o": 1,
                "u": 0
            }]
        }); // arrayLike => Array
        runtime.addFDesc(`${t}.of`, {min: 1, max: Infinity, needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 1, "u": 1}]});
        runtime.addFDesc(`${t}.prototype.copyWithin`, {
            min: 2,
            max: 3,
            needThis:true, forbidden:false , argv: [{"k": "Plus", "o": 0, "u": 0}, {"k": "Plus", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.entries`, {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
        runtime.addFDesc(`${t}.prototype.every`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.fill`, {
            min: 1,
            max: 3,
            needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.filter`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.find`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.findIndex`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.forEach`, {
            min: 1,
            max: 2,
            needThis:false, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.includes`, {
            min: 1,
            max: 2,
            needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.indexOf`, {
            min: 1,
            max: 2,
            needThis:false, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.join`, {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "String", "o": 1, "u": 0}]});
        runtime.addFDesc(`${t}.prototype.keys`, {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
        runtime.addFDesc(`${t}.prototype.lastIndexOf`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Anything", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.map`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.reduce`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Anything", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.reduceRight`, {
            min: 1,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Anything", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.reverse`, {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
        runtime.addFDesc(`${t}.prototype.set`, {
            min: 1,
            max: 2,
            needThis:false, forbidden:false , argv: [{"k": "Array|TypedArray", "o": 0, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.slice`, {
            min: 0,
            max: 2,
            needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.some`, {
            min: 1,
            max: 2,
            needThis:false, forbidden:false , argv: [{"k": "Function", "o": 0, "u": 0}, {"k": "Identifier", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.sort`, {min: 0, max: 1, needThis:true, forbidden:false , argv: [{"k": "Function", "o": 1, "u": 0}]});
        runtime.addFDesc(`${t}.prototype.subarray`, {
            min: 0,
            max: 2,
            needThis:false, forbidden:false , argv: [{"k": "Plus", "o": 1, "u": 0}, {"k": "Plus", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.toLocaleString`, {
            min: 0,
            max: 2,
            needThis:true, forbidden:false , argv: [{"k": "locales", "o": 1, "u": 0}, {"k": "options", "o": 1, "u": 0}]
        });
        runtime.addFDesc(`${t}.prototype.toString`, {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
        runtime.addFDesc(`${t}.prototype.values`, {min: 0, max: 0, needThis:true, forbidden:false , argv: []});
    }
}

module.exports = {
    FDescInit:FDescInit
}