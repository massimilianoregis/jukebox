var exec = require('child_process').exec;

class Cmd {
    static async exec(cmd) {
        console.log(cmd)
        return new Promise((ok, ko) => {
            exec(cmd, (error, stdout, stderr) => {
                if(error) console.log(error)
                if(error) ko(error);
                ok(stdout);
            });
        });
    }
}
exports.Cmd = Cmd;
