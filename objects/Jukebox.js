var path = require("path");
const yt = require('youtube-search-without-api-key');
const archiver = require('archiver');

const { Music } = require("./Music");
const { Playlist } = require("./Playlist");
const { Mocp } = require("./Mocp");
const fs = require("fs");

class JukeBox{
    _volume=100;
    async info(){        
        var {File,State,Artist} = await Mocp.info();      
        if(!File) return;
        var name = path.basename(File,path.extname(File));
        var music = await this.getMusic(name.hash())        
        if(!music) return;
        music.artist=Artist
        music.status=State=="PLAY"?"play":"pause";           
        return music;
    }    
    set volume(value){
        if(value>100 || value<0) return;
        value = parseInt(value);
        Mocp.volumeShade(value,this._volume)
        this._volume=value
    }
    get volume(){
        return this._volume
    }

    root;
    constructor(root,playlist){        
        Music.config(path.resolve(process.cwd(),root))
        Playlist.config(path.resolve(process.cwd(),playlist),this)
    }
    async getMusic(id){
        if(id==null) return this.list();
        var music = await Music.get({id:id});
        if(!music) return;        
        return music;    
    }
    
    async list(){
        return await Music.find();
    }    

    async getPlaylists(){
        return (await Playlist.find()).map(
            playlist=>({...playlist,playing:playlist.name===this.playlist?.name})
            );
    }
    async getPlaylist(name){
        var list = await Playlist.get({name:name})
        if(!list) list = Playlist.new({name:name});
        return list;
    }    
    
    
    async downloadList(array){
        for(var i in array)
            await this.download(array[i]);
    }
    async download(name){
        if(name.match(/^[a-zA-Z0-9-_]{11}$/))
            await this.downloadByCode(name)
        else      
            await this.downloadByName(name)        
    }    
    async downloadByName(name){            
        var file = await this.search(name);                    
        await this.downloadByCode(file.videoId)
    }
    async downloadByCode(code){           
        return new Promise((ok,ko)=>{
            
            if(!this.YD){
                var YoutubeMp3Downloader = require("youtube-mp3-downloader");
                this.YD = new YoutubeMp3Downloader({
                    //"ffmpegPath": "/path/to/ffmpeg",        // FFmpeg binary location
                    "outputPath": Music.root,    // Output file location (default: the home directory)
                    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
                    "queueParallelism": 2,                  // Download parallelism (default: 1)
                    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
                    "allowWebm": false                      // Enable download from WebM sources (default: false)
                });

                this.YD.on("finished", function(err, data) {
                    var {file} = data;
                    if(file.match("\'"))
                        fs.renameSync(file,file.replaceAll("'",""))
                    ok(data);
                });

                this.YD.on("error", function(error) {
                    ko(error)
                    console.log(error);
                });

                this.YD.on("progress", function(progress) {
                    console.log(JSON.stringify(progress));
                });
            }
            var YD=this.YD;

            //Download video and save as MP3 file
            YD.download(code);
        })
    }
    async search(name){
        var list = await yt.search(name);

        return list.map(item=>({
            videoId:item.id.videoId,
            title:item.title,
            duration_raw:item.duration_raw,
            thumb:item.snippet.thumbnails.url,
            views:item.views,
            download:services.link(`/add/${item.id.videoId}`)
        }));
    }
    
    async findBestMatch(name){
        var list = this.search(name);
        return list.reduce((prev, current)=>{
            return (parseInt(prev.views) > parseInt(current.views)) ? prev : current
        }) ;
    }
    async zip(response){
        const archive = archiver('zip', {zlib: { level: 9 }});
        archive.on('end', () => response.end());
        archive.directory('mp3');
        archive.pipe(response)
        archive.finalize();
    }

    async playOrPause(){return Mocp.playOrPause();}
    async play(){return Mocp.continue();}
    async pause(){
        await Mocp.volumeShade(0,Playlist.jukebox.volume);
        await Mocp.pause();
        await Mocp.volume(this.volume);
    }
    async next(){return Mocp.next();}
}
module.exports=JukeBox