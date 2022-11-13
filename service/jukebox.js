var box = new (require("../objects/Jukebox"))("data/mp3","data/playlists");
var app = require("express")();


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
app.get("/next",(req,res)=>{    
    req.jukebox.next();    
    res.redirect("/jukebox")
})
app.get("/",async (req,res)=>{    
    var {title,id,status}=await req.jukebox.info();
    res.json({        
        addPlaylist:req.hateous(`playlist/:name`),
        info:{
            id:id,
            title:title,
            status:status,
            pause:status=="play"?req.hateous(`/jukebox/pause`):undefined,
            play:status=="pause"?req.hateous(`/jukebox/play`):undefined,
        },
        music:await req.services.get('/jukebox/music'),
        playlist:await req.services.get('/jukebox/playlist')
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