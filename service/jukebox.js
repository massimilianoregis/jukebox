var box = new (require("../objects/Jukebox"))("data/mp3","data/playlists");
var app = require("express")();
var os = require("os");

app.use((req,res,next)=>{
    req.jukebox=box;    
    next();
})
app.get("/pause",(req,res)=>{
    req.jukebox.pause();
    res.redirect("/jukebox")
})
app.get("/play",(req,res)=>{    
    req.jukebox.play();    
    res.redirect("/jukebox")
})
app.get("/playorpause",(req,res)=>{    
    req.jukebox.playOrPause()
       
    res.redirect("/jukebox")
})
app.get("/next",(req,res)=>{    
    req.jukebox.next();    
    res.redirect("/jukebox")
})
app.get("/volume/up",(req,res)=>{    
    req.jukebox.volume+=10;   
    res.redirect("/jukebox")
})
app.get("/volume/down",(req,res)=>{    
    req.jukebox.volume-=10;   
    res.redirect("/jukebox")
})
app.get("/volume/:volume",(req,res)=>{    
    req.jukebox.volume=req.params.volume;   
    res.redirect("/jukebox")
})
app.use((req,res,next)=>{
        if(app.myip) return next();
        const networkInterfaces = os.networkInterfaces();

        for (const interfaceName in networkInterfaces) {
            const networkInterface = networkInterfaces[interfaceName];
            
            for (const interface of networkInterface) {
                if (interface.family === 'IPv4' && interface.internal === false) {                
                    app.myip=interface.address;                
                }
            }
        }
    next()
})
app.get("/",async (req,res)=>{    
    var {title,id,status,artist}=await req.jukebox.info()||{};

    
    res.json({        
        url:`http://${app.myip}:${req.port}/mobile`,        
        addPlaylist:req.hateous(`playlist/:name`),
        volume:req.jukebox.volume,
        info:{
            id:id,
            title:title,
            status:status,
            artist:artist,
            volume:req.jukebox.volume,
            pause:status=="play"?req.hateous(`/jukebox/pause`):undefined,
            play:status=="pause"?req.hateous(`/jukebox/play`):undefined,
        },
        playlist:await req.services.get('/jukebox/playlist'),
        music:await req.services.get('/jukebox/music')  
    })    
})

app.use("/playlist",require("./playlist"));
app.use("/music",require("./music"));


app.get("/recoverDB",async (req,res,next)=>{
    res.json(await box.recoverDB());
})
app.get("/search",async (req,res,next)=>{
    var {title}= req.query;    
    
    res.json(await box.search(title))
})
app.get("/add/:code",async (req,res,next)=>{
    var response = await box.download(req.params.code)
    res.json(response)
})

app.get("/download",async (req,res,next)=>{
   box.zip(res)
    
})
app.use("/:id",async (req,res,next)=>{
    req.obj=await box.getMusic(req.params.id);
    if(!req.obj) return res.end();
    next();
})
app.get("/:id",async (req, res)=>{
    res.json(req.obj)
  });
app.get("/:id/download",async (req, res)=>{
    res.download(req.obj.absFile);
  });

module.exports=app;