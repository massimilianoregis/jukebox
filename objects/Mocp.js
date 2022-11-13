const { Cmd } = require("./Cmd");

class Mocp {
    static async info() {
        var info = await Cmd.exec(`mocp -i`);
        info = [...stdout.matchAll(/(?<name>.*?): (?<value>.*?)\n/g)].reduce((a, v) => ({ ...a, [v.groups.name]: v.groups.value }), {});
        return info;
    }
    static async play() {
        await Cmd.exec(`mocp -l ${this.absFile}`);
    }
    static async pause() {
        await Cmd.exec(`mocp -P`);
    }
    static async continue() {
        await Cmd.exec(`mocp -U`);
    }
    static async status() {
        await Cmd.exec(`mocp -i`);
    }
    static async append(musics) {
        Promise.all(
            musics.map(item => Cmd.exec(`mocp -q ${item.absFile}`))
        );
    }
    static async clear() {
        await Cmd.exec(`mocp -c`);
    }
}
exports.Mocp = Mocp;
