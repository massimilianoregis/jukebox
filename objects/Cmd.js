var exec = require('child_process').exec;

class Cmd {
    static async exec(cmd) {
        return new Promise((ok, ko) => {
            exec(cmd, (error, stdout, stderr) => {
                ok(info);
            });
        });
    }
}
exports.Cmd = Cmd;
