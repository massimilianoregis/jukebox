var app = require("express")();

    app.get("/",async (req,res)=>{
        res.json(
            (await req.jukebox.getPlaylists())
            .map(playlist=>({
                name:playlist.name,                
                items:playlist.music?.length,
                detail:req.hateous(`${playlist.name}`),
                play:req.hateous(`${playlist.name}/play`)
            }))
        );
    })
    app.use("/:name",async(req,res,next)=>{
        var {name}= req.params;        
        req.obj= await req.jukebox.getPlaylist(name);
        
        next();
    })

    app.get("/:name/play",async(req,res,next)=>{        
        await req.obj.play();        
        res.redirect('/jukebox')
    })
    app.get("/:name/add/:music",async (req,res)=>{
        var {music,name}= req.params;
        var item = await req.jukebox.getMusic(music)
        req.obj.addMusic(item);
        req.obj.save();
        res.redirect(`/jukebox/playlist/${name}`);
    })
    app.get("/:name",async (req,res)=>{
        res.json({
            jukebox:req.hateous("/jukebox"),
            shuffle:req.hateous("shuffle"),
            ...req.obj, 
            music:req.obj.music.map((music,index)=>({
                id:music?.id,
                title:music?.title,
                remove:req.hateous(`remove/${index}`),
            })),
            addMusic:(await req.jukebox.getMusic()).map(item=>({
                title:item.title,
                add:req.hateous(`add/${item.id}`)
            }))
        });
    })    
    app.get("/:name/shuffle",async (req,res)=>{
        req.obj.shuffle();
        await req.obj.save()
        res.redirect(req.hateous(`../`))
    })
module.exports=app;