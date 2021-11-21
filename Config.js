const userInfo = require("os").userInfo();
const storagePath = "./fuzz_result/";
const shellPathFuzz = "./v8_build/normal_build/d8";
const shellPathNormal = "./v8_build/normal_build/d8";

const config = {};
config.needThisListPath = "Core/needThisList.json";
config.propertyTypeDBPath = "Core/propertyTypeDB.json";

config.useJITFormat = true;
config.useConstructors = false;

//(TODO allowDBWrite
config.doWriteDBAllow = false;
config.doWriteDB = false;
config.doWriteNT = false;
config.doUpdateType = true;
config.debug = false;
config.maxExecutionRound = 100;
config.watchDogFreq = 1000 * 1;
config.totallines = 30;
config.initiallines = 7;
config.function_totallines = 8;
config.function_initiallines = 2;
config.maxExecutionTime = 1000 * 5;
config.arguments = ["--debug-code",
    "--expose-gc",
    "--predictable",
    "--allow-natives-syntax",
    "--interrupt-budget=1024",
    "--gc-interval=1",
    "--no-arguments"];

config.storagePath = storagePath;
config.shellPath = shellPathFuzz;
config.shellPathNormal = shellPathNormal;
config.workDir = config.storagePath + "workdir/";
config.workerDir = config.storagePath + "workdir/" + "worker_default/";
config.crashDir = config.storagePath + "crashes/";


module.exports = config;

