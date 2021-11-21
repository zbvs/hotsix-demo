const util = require("./Util");
const fs = require("fs-extra");
const config = require("./Config");
const hotsixFuzz = require("./HotsixFuzz.js");
const {exec} = require('child_process');
const prefix = "Main:";

//<- childon
//init ->
//<- inited
//generate ->
//<- generated
//execute ->
//<- finish

//generate ->
//<- generated
//execute ->
//<- finish

const Protocol = {
    init: "init",
    generate: "generate",
    execute: "execute",

    childon: "childon",
    inited: "inited",
    generated: "generated",
    finish: "finish",
};


//https://github.com/brianmcd/contextify/blob/master/src/contextify.cc
//https://github.com/nodejs/node/blob/master/lib/vm.js
const masterMsg = {
    packet: "",
    data: ""
};

let print = (...arg) => {
    console.log(prefix, ...arg);
};

let hotsix = {};


let init = () => {
    exec('ulimit -c unlimited');
    hotsix.Timer = new util.Timer();
    hotsix.fuzzArr = [];
    hotsix.addFuzz = (fuzz) => {
        hotsix.fuzzArr.push(fuzz);
    };

    hotsix.Statistic = {
        totalExec: 0,
        totalCrash: 0,
        totalError: 0,
        execsPerSec: 0,
    };

    setInterval(watchDog, config.watchDogFreq);
    if (!fs.existsSync(config.storagePath)) {
        fs.mkdirSync(config.storagePath);
    }

    if (!fs.existsSync(config.workDir)) {
        fs.mkdirSync(config.workDir);
    }

    if (!fs.existsSync(config.crashDir)) {
        fs.mkdirSync(config.crashDir);
    }
};


let printStatistic = () => {
    let Statistic = hotsix.Statistic;

    util.print('');
    for (let fuzz of hotsix.fuzzArr) {
        util.print("id:", fuzz.workerId);
        util.print("state:", fuzz.state);
        util.print("cur execution time:", fuzz.Timer.checkRoundTime());
        util.print("execution cycle-round:", fuzz.cycle, fuzz.executionRound);
        util.print("execs per sec:", fuzz.execsPerSec);
        util.print('');
    }
    let totalTime = hotsix.Timer.totalTime();
    util.print('-----------------------------------------');
    util.print("totalExec:", Statistic.totalExec);
    util.print("totalExec/sec:", Statistic.totalExec / hotsix.Timer.totalTime() | 0);
    util.print("totalCrash:", Statistic.totalCrash);
    util.print("totalError:", Statistic.totalError);
    util.print("totalTime D-H-M-S:", totalTime / (60 * 60 * 24) | 0, (totalTime / (60 * 60) | 0) % 24, (totalTime / (60) | 0) % (60), totalTime % 60 | 0);
    util.print('-----------------------------------------');
};

let watchDog = () => {

    printStatistic();
    for (let fuzz of hotsix.fuzzArr) {
        util.print(fuzz.workerId, "] roundtime:", fuzz.Timer.checkRoundTime());
        if (fuzz.Timer.checkRoundTime() >= (config.maxExecutionTime / 1000)) {
            fuzz.closeChild();
        }
    }
};

//setInterval(printStatistic, 5000,Statistic);


hotsix.crashId = 1;


process.on('SIGINT', () => {

    for (let fuzz of hotsix.fuzzArr) {
        try {
            fuzz.fd.kill();
            fuzz.prev_fd = fuzz.fd;
            fuzz.fd = null;
            if (targetpid !== -1) {
                process.kill(fuzz.targetpid, "SIGKILL");
                fuzz.targetpid = -1;
            }
        } catch (e) {

        }
    }
    print("hotsix fuzz exit");
    printStatistic();
    process.exit();

});


let ChildHandler = (workerId) => {
    let fuzz = new hotsixFuzz(workerId);
    hotsix.addFuzz(fuzz);
    fuzz.newChild(hotsix);

};


let Main = () => {
    init();
    const os = require("os");
    for (let i = 0; i < os.cpus().length; i++) {
        ChildHandler(i);
    }
};

Main();

