const createProgram = require('./Core/Environment/Program.js').createProgram;
const config = require("./Config");
const util = require("./Util")
const generator = require("./Core/Generator");
const codeRecorder = require("./Recorder").CodeRecorder;
const {spawn} = require('child_process');

const prefix = "Child:";


const Protocol = {
    init: "init",
    generate: "generate",
    execute: "execute",


    childon: "childon",
    inited: "inited",
    generated: "generated",
    finish: "finish",
};

const clientMsg = {
    packet: "",
    data: null
};


clientMsg.packet = Protocol.childon;
process.send(clientMsg);


let print = (...arg) => {
    console.log(prefix, ...arg);
};


let generateOne = (fuzzChild) => {
    let program = createProgram(generator);
    generator.runtime = program.runtime;
    fuzzChild.isError = false;
    try {
        //(TODO: do we need this check?
        if (fuzzChild.round !== fuzzChild.try) {
            print("something is wrong...", fuzzChild.round, fuzzChild.try)
            process.kill(fuzzChild.ppid, "SIGKILL");
        }

        fuzzChild.try++;
        generator.JITProgram(program);
    } catch (e) {
        fuzzChild.error++;
        fuzzChild.isError = true;
    }

};


let childMain = () => {
    let fuzzChild = {};
    fuzzChild.try = 0;
    fuzzChild.round = 0;
    fuzzChild.error = 0;
    fuzzChild.spawned = null;
    fuzzChild.workerId = -1;
    fuzzChild.ppid = -1;
    fuzzChild.isError = false;
    let spawnTarget = (target_args) => {
        let spawned = spawn(config.shellPath, target_args);

        spawned.stdin.setEncoding('utf-8');
        spawned.stdin.on('data', onData);
        spawned.stdin.on('close', onClose);
        fuzzChild.spawned = spawned;
        return spawned;
    };

    let onData = (data_str) => {

        if (typeof data_str !== "string")
            data_str = String.fromCharCode.apply(data_str, data_str);

        let size = data_str.length;
        if (size >= 4)
            data_str = data_str.substr(size - 4, size);

        if (data_str === "DONE") {
            let result = {
                isCrash: false,
                targetpid: fuzzChild.spawned.pid,
                workerId: fuzzChild.workerId,
                tryCnt: fuzzChild.try,
                errorCnt: fuzzChild.error,
                isError: fuzzChild.isError
            };
            clientMsg.packet = Protocol.finish;
            clientMsg.data = result;
            process.send(clientMsg);
        }
    };


    let onClose = () => {
        console.log("on crash:");
        //assume that it is crash. child would be closed also.
        let result = {
            isCrash: true,
            targetpid: fuzzChild.spawned.pid,
            workerId: fuzzChild.workerId,
            tryCnt: fuzzChild.try,
            errorCnt: fuzzChild.error,
            isError: fuzzChild.isError
        };
        clientMsg.packet = Protocol.finish;
        clientMsg.data = result;
        process.send(clientMsg);
    };

    function Child(masterMsg) {
        switch (masterMsg.packet) {
            case Protocol.init : {
                fuzzChild.workerId = masterMsg.data.workerId;
                fuzzChild.ppid = masterMsg.data.ppid;
                config.doWriteDB = false;
                if (config.doWriteDBAllow === true && masterMsg.data.doWriteDB === true)
                    config.doWriteDB = true;
                config.doWriteNT = masterMsg.data.doWriteNT;
                config.workerDir = config.storagePath + "workdir/" + "worker" + fuzzChild.workerId + "/";
                codeRecorder.setPath();
                config.arguments.push(codeRecorder.rootFile);
                let spawned = spawnTarget(config.arguments);
                fuzzChild.spawned = spawned;
                clientMsg.packet = Protocol.inited;
                clientMsg.data = {targetpid: spawned.pid, rootFile: codeRecorder.rootFile};
                process.send(clientMsg);
                break;
            }
            case Protocol.generate : {
                fuzzChild.round = masterMsg.data.round;
                generateOne(fuzzChild);
                clientMsg.packet = Protocol.generated;
                clientMsg.data = {round: fuzzChild.round};
                process.send(clientMsg);
                break;
            }
            case Protocol.execute : {
                let spawned = fuzzChild.spawned;
                spawned.stdin.write("\n");
                break;
            }
        }
    }

    process.on('message', Child);
};

process.on("uncaughtException", function (err) {
    if (!err.message.includes("read ECONNRESET")) {
        process.exit();
    }
});

childMain();

