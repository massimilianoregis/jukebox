var app = require("express")();

    app.get("/",async (req,res,next)=>{

        var list = (await req.jukebox.list())
            .map(item=>({
                id:item.id,
                title:item.title,
                detail:req.hateous(`${item.id}`),
                download:`http://${req.get("host")}/${item.id}/download`
            }))
        res.json({
            download:`http://${req.get("host")}/download`,
            recoverDB:`http://${req.get("host")}/recoverDB`,
            music:list
        })
    })
    app.use("/:id",async(req,res,next)=>{
        var {id}= req.params;
        req.obj= await req.jukebox.getMusic(id);
        next();
    })
    app.get("/:id",async(req,res,next)=>{
        res.json({
            ...req.obj,
            jukebox:req.hateous('/jukebox')
        })
    })
module.exports=app;