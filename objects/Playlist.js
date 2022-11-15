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
            return (await this.find()).find(item=>item.name==name);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    static async find() {
        try {            
            var list = await Promise.all(
                fs.readdirSync(this.root).map((item) => new Playlist(item).load())
            );

            list.unshift(await new AllPlaylist().load());
            return list;
        }
        catch (e) {console.log(e); return []; }
    }
    async save() {
        fs.writeFileSync(path.resolve(Playlist.root, `${this.name}.json`), JSON.stringify(this.toJSON()));
    }
    constructor(name) {
        if(name)    this.name = path.basename(name, path.extname(name) || "");
        this.music = [];

    }

    async play() {        
        this.shuffle()
        await Mocp.volumeShade(0,Playlist.jukebox.volume);
        await Mocp.pause();
        await Mocp.clear();        
        await Mocp.volume(Playlist.jukebox.volume);        
        await Mocp.play(this.music);
        Playlist.jukebox.playlist=this;
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


class AllPlaylist extends Playlist{
    async load() {        
        try {            
            this.name = "All";
            this.music = await Playlist.jukebox.list()            
        } finally {
            return this;
        }
    }
}