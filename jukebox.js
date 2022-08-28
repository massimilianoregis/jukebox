var path = require("path");
var fs = require("fs");
const {Document} = require("./util/persistence")
const yt = require('youtube-search-without-api-key');
const services = require("./util/services");
const generateZipForPath= require("./lib/generateZipForPath")

class Music extends Document{    
    toJSONDB(){
        return {
            title:this.title,
            videoId:this.videoId,
            file:this.file
        }
    }
    toJSON(){
        return {
            uuid: this.uuid,
            title:this.title,
            videoId:this.videoId,
            file:this.file
        }
    }
}

class JukeBox{
    constructor(){
        this.test();
        Music.config("db")
        
    }
    async getMusic(id){
        var music = await Music.get({videoId:id});
        if(!music) return;
        music.absFile=path.resolve(__dirname,"mp3",music.file)
        return music;    
    }
    async downloadList(array){
        for(var i in array)
            await this.download(array[i]);
    }
    async download(name){
        console.log(name)
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
        var file=await Music.get({videoId:code})        
        if(file)  return;       
        return new Promise((ok,ko)=>{
            
            var YoutubeMp3Downloader = require("youtube-mp3-downloader");
            var YD = new YoutubeMp3Downloader({
                //"ffmpegPath": "/path/to/ffmpeg",        // FFmpeg binary location
                "outputPath": path.resolve(__dirname,"mp3"),    // Output file location (default: the home directory)
                "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
                "queueParallelism": 2,                  // Download parallelism (default: 1)
                "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
                "allowWebm": false                      // Enable download from WebM sources (default: false)
            });

            //Download video and save as MP3 file
            YD.download(code);

            YD.on("finished", function(err, data) {
                Music.new({
                    title:data.title, 
                    videoId:data.videoId,
                    file:`${data.videoTitle}.mp3`})
                ok(data);
            });

            YD.on("error", function(error) {
                ko(error)
                console.log(error);
            });

            YD.on("progress", function(progress) {
                console.log(JSON.stringify(progress));
            });
          
        })
    }

    async list(){
        return await Music.find();
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
    async zip(){
        return await generateZipForPath("mp3");         
    }
    async test(){
        //console.log(await this.search("manifesto futurista della nuova umanita"))
        //console.log(await this.search("camera a sud vinicio capossela"))
    }
}
module.exports=JukeBox