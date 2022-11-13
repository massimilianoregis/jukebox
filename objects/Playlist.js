var path = require("path");
var fs = require("fs");
const { Mocp }  = require("./Mocp");

class Playlist {
    static config(dir, jukebox) {
        this.jukebox = jukebox;
        this.root = dir;
        fs.mkdirSync(Playlist.root, { recursive: true });
    }

    static async new({ name }) {
        return new Playlist(name);
    }
    static async get({ name }) {
        try {
            return new Playlist(name).load();
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    static async find() {
        try {
            return Promise.all(
                fs.readdirSync(this.root).map((item) => new Playlist(item).load())
            );
        }
        catch (e) { return []; }
    }
    async save() {
        fs.writeFileSync(path.resolve(Playlist.root, `${this.name}.json`), JSON.stringify(this.toJSON()));
    }
    constructor(name) {
        this.name = path.basename(name, path.extname(name) || "");
        this.music = [];

    }

    async play() {        
        await Mocp.volumeShade(0,this.jukebox.volume);
        await Mocp.clear();
        await Mocp.append(this.music);
        await Mocp.volume(this.jukebox.volume);        
        await Mocp.play();
    }

    shuffle() {
        var array = this.music;
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        this.music = array;
    }
    async load() {        
        var file = path.resolve(Playlist.root, `${this.name}.json`);
        
        try {
            var { name, music } = JSON.parse(fs.readFileSync(file).toString());
            this.name = name;
            this.music = await Promise.all(
                music.map(({ id }) => Playlist.jukebox.getMusic(id))
            );
            return this;
        } catch (e) {
            return this;
        }
    }

    addMusic(music) {
        this.music.push(music);
    }

    toJSON() {
        return {
            name: this.name || "no name",
            music: this.music.map(item => ({ id: item.id }))
        };
    }
}
exports.Playlist = Playlist;
