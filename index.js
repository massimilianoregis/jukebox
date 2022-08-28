var box = new (require("./jukebox"))();
var app = require("express")();
const services = require("./util/services");
services.gateway="http://167.172.198.47:3000"


app.get("/",async (req,res,next)=>{
    var list = (await box.list())
        .map(item=>({
            title:item.title,
            download:`http://${req.get("host")}/${item.id}/download`
        }))
    res.json({
        download:`http://${req.get("host")}/download`,
        recoverDB:`http://${req.get("host")}/recoverDB`,
        music:list
    })
})
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
app.get("/:id/download",async (req, res)=>{
    res.download(req.obj.absFile);
  });

app.listen(3002)