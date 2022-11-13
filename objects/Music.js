var path = require("path");
var fs = require("fs");
const { Mocp } = require("./Mocp");

class Music {
    static config(dir) {
        this.root = dir;
        fs.mkdirSync(Music.root, { recursive: true });
    }
    static async find() {
        return fs.readdirSync(this.root).map((item) => new Music(item));
    }
    static async get({ id }) {
        return (await this.find()).find(item => item.id == id);
    }

    constructor(file) {
        this.file = file;
    }
    get id(){
        return this.title().hash();        
    }
    get absFile(){
        return path.resolve(Music.root, this.file);
    }
    get title() {
        var ext = path.extname(this.file);
        return path.basename(this.file, ext);
    }

    play() {
        this.status = "play";
        Mocp.play();
    }
    pause() {
        this.status = "pause";
        Mocp.pause();
    }
    continue() {
        Mocp.continue();
    }

}
exports.Music = Music;
