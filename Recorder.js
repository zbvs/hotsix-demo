const config = require("./Config");

const escodegen = require('./lib/escodegen-bigint');
const fs = require("fs");

const CodeRecorder = {
    setPath() {
        this.workerDir = config.workerDir;


        if (!fs.existsSync(this.workerDir)) {
            fs.mkdirSync(this.workerDir);
        }

        this.originFile = "";
        this.rootFile = this.workerDir + "origin1.js";
        this.errorFile = this.workerDir + "error.js";
        this.boxedFile = this.workerDir + "boxed.js";
        this.backupFile = "";
    },
    deleteOriginFile() {
        fs.unlinkSync(this.originFile);
    },
    setFileLevel(level) {
        this.originFile = this.workerDir + "origin" + level + ".js";
        this.backupFile = this.workerDir + "backup" + level + ".js";
    },
    eraseAllFile() {
        fs.writeFileSync(this.boxedFile, "");
        fs.writeFileSync(this.errorFile, "");
    },
    writeRootFile(data) {
        data += '\n';
        fs.writeFileSync(this.workerDir + "origin1" + ".js", data);
    },
    eraseOriginFile(data = "") {
        if (data !== "")
            data += '\n';
        fs.writeFileSync(this.originFile, data);
    },
    updateBoxedFile(code) {
        this.fs.appendFileSync(this.boxedFile, code);
    },
    updateOriginFile(code) {
        this.fs.appendFileSync(this.originFile, code);
        this.fs.appendFileSync(this.errorFile, code);
    },
    debugCode(nodeStack) {
        let size = nodeStack.length;
        let resultString = this.startLine;
        let i = 0;
        while (size--) {
            let node = nodeStack[i++];
            let code = this.escodegen.generate(node);
            resultString += code + ";";
            resultString += this.endLine;
        }
        this.fs.appendFileSync(this.errorFile, resultString);
    },
    backupCode(nodeStack) {
        let size = nodeStack.length;
        let resultString = '';
        let i = 0;
        while (size--) {
            let node = nodeStack[i++].origin;
            let code = this.escodegen.generate(node);
            resultString += code + ";";
            resultString += this.startLine;
        }
        this.fs.writeFileSync(this.backupFile, resultString);
    },
    startLine: "\n\/\/<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n",
    endLine: "\n\/\/>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n",
    fs: fs,
    originFile: "",
    rootFile: "",
    escodegen: escodegen,
};

const Recorder = {
    CodeRecorder: CodeRecorder,
};

module.exports = Recorder;
