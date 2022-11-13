const { Cmd } = require("./Cmd");
var example=`
State: PAUSE
File: /home/pi/jukebox/data/mp3/Colapesce, Dimartino - Musica leggerissima (Official Video - Sanremo 2021).mp3
Title: Colapesce, Dimartino - Musica leggerissima (Official Video
Artist: Colapesce, Dimartino
SongTitle: Musica leggerissima (Official Video
Album: 
TotalTime: 03:43
TimeLeft: 03:40
TotalSec: 223
CurrentTime: 00:03
CurrentSec: 3
Bitrate: 160kbps
AvgBitrate: 160kbps
Rate: 44kHz
`
class Mocp {
    static async info() {
        var info = await Cmd.exec(`mocp -i`);
        info=example;
        info = [...info.matchAll(/(?<name>.*?): (?<value>.*?)\n/g)].reduce((a, v) => ({ ...a, [v.groups.name]: v.groups.value }), {});
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