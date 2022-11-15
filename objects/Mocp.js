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
    static async mute(actVolume){
        await this.volume(actVolume,0)
    }
    static async volumeShade(volume,actVolume) {        
        console.log(actVolume,"-->",volume)
        
        do{
            if(volume<actVolume) actVolume--;
            else                 actVolume++;
            if(actVolume%10==0)  await this.volume(actVolume);
        }while(volume!=actVolume)        
        await this.volume(volume);
    }
    static async volume(volume) {
        await Cmd.exec(`mocp -v ${volume}`);
    }
    static async play(musics=[]) {
        for(var i in musics){
            await Cmd.exec(`mocp -a '${musics[i].absFile}'`)        
            if(i==0)    await Cmd.exec(`mocp -p`);
        }
        if(musics.length==0) await Cmd.exec(`mocp -p`);        
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
        for(var i in musics)
            await Cmd.exec(`mocp -a '${musics[i].absFile}'`)        
    }
    static async clear() {
        await Cmd.exec(`mocp -c`);
    }
    static async next() {
        await Cmd.exec(`mocp -f`);
    }
}
exports.Mocp = Mocp;
