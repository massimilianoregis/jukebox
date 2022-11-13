const { Cmd } = require("./Cmd");
var example=`
State: PAUSE
File: /home/pi/jukebox/data/mp3/A un passo da te.mp3
Title: A un passo da te
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
        info=info||example;
        info = [...info.matchAll(/(?<name>.*?): (?<value>.*?)\n/g)].reduce((a, v) => ({ ...a, [v.groups.name]: v.groups.value }), {});
        return info;
    }
    static async play() {
        await Cmd.exec(`mocp -p`);
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
            musics.map(item => Cmd.exec(`mocp -a ${item.absFile}`))
        );
    }
    static async clear() {
        await Cmd.exec(`mocp -c`);
    }
}
exports.Mocp = Mocp;
