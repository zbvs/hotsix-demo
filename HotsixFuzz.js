const child_process = require('child_process');
const fork = child_process.fork;
const util = require("./Util.js");
const config = require("./Config.js");
const fs = require("fs-extra");


//<- childon
//init ->
//<- inited
//generate ->
//<- generated
//execute ->
//<- finish

//generate ->
//<- generated

const log = false;

let print = (...arg) => {
    let prefix = "Master:"
    console.log(prefix, ...arg);
};


const Protocol = {
    init: "init",
    generate: "generate",
    execute: "execute",

    childon: "childon",
    inited: "inited",
    generated: "generated",
    finish: "finish",
};

const ChildState = {
    wait_childon: "wait_childon",
    wait_init: "wait_init",
    wait_generate: "wait_generate",
    wait_finish: "wait_finish",
    wait_recreate: "wait_recreate",

    terminated: "terminated",
};

const TimerState = {
    setted: "setted",
    cleared: "cleared"
};


class hotsixFuzz {
    constructor(workerId, onMessage, onExit) {
        this.workerDir = config.storagePath + "workdir/" + "worker" + workerId + "/";
        this.state = null;
        this.workerId = workerId;
        this.rootFile = "";
        this.executionRound = 0;
        this.times;
        this.lastClearedCycle = -1;
        this.cycle = 0;
        this.targetpid = -1;
        this.Timer = new util.Timer();
        this.execsPerSec = 0;
        this.prev_fd = null;
        this.Message = {
            packet: "",
            data: ""
        };
    }

    clearAll() {
        if (this.lastClearedCycle === this.cycle)
            return;
        this.lastClearedCycle = this.cycle;

        for (let time of this.times) {
            if (time.state === TimerState.setted) {
                clearTimeout(time.timeout);
            }
        }
    }

    clearTimeout(rnd) {

        if (rnd >= this.times.length || this.times[rnd].state === TimerState.cleared)
            util.abort("invalied round");

        let time = this.times[rnd];

        if (log) {
            print("\n--------      cleared -------------\n");
            print("timeout cleared: worker ", this.workerId, " , cycle-round", this.cycle, this.executionRound,);
            print("timeout:", time);
        }


        clearTimeout(time.timeout);

        time.state = TimerState.cleared;
    }

    setTimeout(rnd) {
        if (rnd > this.times.length)
            util.abort("invalied round");


        let time = {timeout: null, state: "setted"};
        time.timeout = setTimeout((fuzz, prevCycle, prevRound) => {
            if (true) {
                print("worker id:", fuzz.workerId, "prev cycle-round:", prevCycle, prevRound);
            }
            if (fuzz.executionRound === prevRound && fuzz.cycle === prevCycle) {
                fuzz.closeChild();
            }
        }, config.maxExecutionTime, this, this.cycle, this.executionRound);

        if (log) {
            print("\n--------      setted -------------\n");
            print("timeout cleared: worker ", this.workerId, " , cycle-round", this.cycle, this.executionRound,);
            print("timeout:", this.times[this.executionRound]);
        }
        this.times.push(time);
    }

    dumbHandler() {

    }

    send(msg) {
        try {
            this.fd.send(msg);
            ;
        } catch (e) {
            console.log(e);
            this.dumbHandler();
        }
    }

    closeChild() {
        if (this.fd !== null)
            this.fd.kill();
        this.prev_fd = this.fd;
        this.fd = null;

        this.Timer.offTimer();

        let target_pid = this.targetpid;
        let path = "/proc/" + target_pid + "/exe"
        if (fs.existsSync(path) && fs.readlinkSync(path) === config.shellPath) {
            if (this.targetpid !== -1) {
                process.kill(this.targetpid, "SIGKILL");
                this.targetpid = -1;
            }
        }

        this.state = ChildState.terminated;
        let elapsed = this.Timer.checkCycleTime() / 1000;
        this.execsPerSec = this.executionRound / elapsed;
    }

    handleCrash(hotsix) {
        var validate = child_process.spawnSync("python", ["./tools/validate_crash.py", config.shellPathNormal, this.rootFile], {encoding: 'utf8'});
        if (validate.status === 1) {
            print("validation result:\n", validate);
            hotsix.Statistic.totalCrash += 1;
            fs.copySync(
                this.workerDir,
                config.crashDir + "crash" + hotsix.crashId++
            );
        } else if (validate.status !== 0) {
            print("validate  error");
            process.exit(0);
        }
    }

    newChild(hotsix) {
        // !!! Caution !!!
        // Don't use "this"  keyword for fuzz object.
        // Callback might not be able to receive "this" as fuzz object.
        let fuzz = this;
        fuzz.cycle += 1;
        fuzz.fd = fork("./Child.js");
        fuzz.state = ChildState.wait_childon;
        fuzz.executionRound = 0;
        this.times = [];

        let onMessage = (clientMsg) => {
            //print("msg id:",fuzz.workerId, clientMsg)
            switch (clientMsg.packet) {
                case Protocol.childon: {
                    fuzz.state = ChildState.wait_init;
                    fuzz.Message.packet = Protocol.init;
                    if (fuzz.workerId === 0)
                        fuzz.Message.data = {
                            workerId: fuzz.workerId,
                            doWriteDB: true,
                            doWriteNT: true,
                            ppid: process.pid
                        };
                    else
                        fuzz.Message.data = {
                            workerId: fuzz.workerId,
                            doWriteDB: false,
                            doWriteNT: false,
                            ppid: process.pid
                        };
                    if (fuzz.fd) {
                        fuzz.send(fuzz.Message);
                    }
                    break;
                }

                case Protocol.inited: {
                    fuzz.state = ChildState.wait_generate;
                    fuzz.targetpid = clientMsg.data.targetpid;
                    fuzz.rootFile = clientMsg.data.rootFile;
                    fuzz.Message.packet = Protocol.generate;
                    fuzz.Message.data = {round: fuzz.executionRound};
                    fuzz.Timer.setRoundStart();
                    //print("worker ",fuzz.workerId," , timeout setted");
                    if (fuzz.fd) {
                        fuzz.send(fuzz.Message);
                    }
                    break;
                }

                case Protocol.generated: {

                    fuzz.state = ChildState.wait_finish;
                    fuzz.executionRound += 1;
                    fuzz.Message.packet = Protocol.execute;
                    fuzz.Message.data = null;
                    fuzz.Timer.setRoundStart();
                    if (fuzz.fd) {
                        fuzz.send(fuzz.Message);
                    }

                    break;
                }

                case Protocol.finish: {
                    hotsix.Statistic.totalExec += 1;
                    let result = clientMsg.data;
                    fuzz.targetpid = result.targetpid;
                    if (result.isError)
                        hotsix.Statistic.totalError += 1;
                    if (result.isCrash) {
                        print("crash reported");
                        fuzz.handleCrash(hotsix);
                        if (this.state !== ChildState.terminated) {
                            fuzz.closeChild();
                        }
                    } else {
                        if (fuzz.executionRound >= config.maxExecutionRound) {
                            fuzz.state = ChildState.wait_recreate;
                            fuzz.closeChild();
                        } else {
                            fuzz.state = ChildState.wait_generate;
                            fuzz.Message.packet = Protocol.generate;
                            fuzz.Message.data = {round: fuzz.executionRound};
                            fuzz.Timer.setRoundStart();
                            //print("worker ",fuzz.workerId," , timeout setted");

                            if (fuzz.fd) {
                                try {
                                    fuzz.send(fuzz.Message);
                                } catch (e) {
                                    print(e);
                                }
                            }
                        }
                    }
                    break;
                }
            }
        };

        let onExit = () => {

            fuzz.clearAll();

            let unexpectedExit = false;
            if (fuzz.state !== ChildState.terminated) {
                unexpectedExit = true;
                let target_pid = fuzz.targetpid;
                let path = "/proc/" + target_pid + "/exe"
                if (fs.existsSync(path) && fs.readlinkSync(path) === config.shellPath) {
                    if (fuzz.targetpid !== -1) {
                        process.kill(fuzz.targetpid, "SIGKILL");
                        fuzz.targetpid = -1;
                    }
                }
            }


            let fd;
            if (fuzz.fd)
                fd = fuzz.fd;
            else
                fd = fuzz.prev_fd;

            if (unexpectedExit && fd.signalCode && fd.signalCode !== "SIGTERM") {
                fuzz.handleCrash(hotsix);
            }

            fuzz.newChild(hotsix);
        };

        let onError = () => {

        };

        fuzz.fd.on("message", onMessage);
        fuzz.fd.on("exit", onExit);
        fuzz.fd.on("error", onError);
        return fuzz.fd;
    }
}

module.exports = hotsixFuzz;


