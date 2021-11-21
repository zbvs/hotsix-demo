const config = require("./Config");
const debug = config.debug;

const escodegen = require('./lib/escodegen-bigint');
const child_process = require('child_process');
const fs = require("fs")

const now = require("performance-now");

class Timer {
    constructor() {
        this.current = now();
        this.start = this.current;
        this.last = this.current;
        this.roundStart = -1;
    }

    totalTime() {
        return (now() - this.start) / 1000 | 0;
    }

    setRoundStart() {
        this.roundStart = now();
        this.off = false;
    }

    checkRoundTime() {
        if (this.off === true)
            return 0;
        else
            return ((now() - this.roundStart) / 1000 | 0);
    }

    checkCycleTime() {
        this.current = now();
        let elapsed = this.current - this.last;
        this.last = this.current;
        return elapsed;
    }

    offTimer() {
        this.off = true;
    }
};


const util = {
    Timer: Timer,
    executeOrigin() {
        "use strict";
        var child = child_process.spawnSync("node", ["./../storage/workdir/origin1.js"], {encoding: 'utf8'});
        if (child.error) {
            console.log("ERROR: ", child.error);
            this.unreachable();
        }
        let data = child.stderr;
        if (data.length) {
            let start_str = "origin1.js:";
            let startIdx = data.indexOf(start_str);
            let endIdx = data.indexOf("\n");
            let idx = Number(data.substring(startIdx + start_str.length, endIdx))
            return {linenum: idx, data: data};
        }
        return {linenum: -1, data: ""};
    },
    executeGetError() {
        "use strict";
        let content = fs.readFileSync(config.workerDir + 'backup1.js', 'utf8');
        const codeRecorder = require("./Recorder").CodeRecorder;
        //fs.appendFileSync(codeRecorder.rootFile, content);

        var child = child_process.spawnSync("node", ["--allow-natives-syntax", "--expose-gc", codeRecorder.rootFile], {encoding: 'utf8'});
        if (child.error) {
            console.log("ERROR: ", child.error);
            this.unreachable();
        }
        let data = child.stderr;
        if (data.length) {
            let start_str = "origin1.js:";
            let startIdx = data.indexOf(start_str);
            let endIdx = data.indexOf("\n");
            let idx = Number(data.substring(startIdx + start_str.length, endIdx))
            return {linenum: idx, data: data};
        }
        return {linenum: -1, data: ""};
    },
    randRange(start, end) {
        return Math.floor(Math.random() * (end - start)) + start;
    },
    dprint(arg, msg) {
        if (debug) {
            util.lprint("dprint:", msg);
            console.dir(arg);
        }
    },
    lprint() {
        if (debug) {
            console.log.apply(this, arguments);
        }
    },
    print(...args) {
        console.log(...args)
    },
    dumpAst(nodesStack) {
        if (debug) {
            util.unreachable();
            util.lprint("dumpAst");
            let size = nodesStack.length;
            let resultString = '';
            let i = 0;
            while (size--) {
                let node = nodeStack[i++].origin;
                let code = escodegen.generate(node);
                util.lprint(code + ";");
            }
        }
    },
    getDebugProxy(arg) {
        const proxy_handler = {
            defineProperty(target, key, descriptor) {
                if (this.debugCheckOn) util.assert(key in target);
                target[key] = descriptor.value;
                return false
            },
            get(target, key, receiver) {
                if (this.debugCheckOn && !+key.toString().includes("Symbol(Symbol."))
                    util.assert(key in target);
                return target[key];
            },
            set(target, key, value) {
                if (this.debugCheckOn) util.assert(target.hasOwnProperty(key));
                target[key] = value;
                return true;
                s
            }
        };
        return new Proxy(arg, proxy_handler);

    },
    proxyDebugOn: false,
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj,
            function (k, v) {
                return v === undefined ? null : v;
            }
            ),
        );
    },


    chooseRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    removeFromArray(array, values) {
        for (let value of values) {
            this.removeFrom(array, value)
        }

    },
    removeFrom(array, value) {
        let index = array.indexOf(value)
        while (index > -1) {
            array.splice(index, 1);
            index = array.indexOf(value)
        }
    },

    callstack() {
        var stack = new Error().stack
        console.log(stack)
    },
    assert(flag, msg) {
        if (!flag)
            throw new util.DebugError("Assert:" + msg);
    },

    abort(msg) {
        throw new util.DebugError("Abort:" + msg);
    },
    unreachable() {
        throw new util.DebugError("Unreachable code");
    },
    nodeCheck() {

    },
    error() {

    }
}

class DebugError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "DebugError"; // (different names for different built-in error classes)
    }
}

util.DebugError = DebugError;
module.exports = util;

