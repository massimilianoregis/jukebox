var box = new (require("./jukebox"))();
var app = require("express")();
const services = require("./util/services");
services.gateway="http://167.172.198.47:3000"

app.get("/",async (req,res,next)=>{
    res.json(await box.list())
})
app.get("/search",async (req,res,next)=>{
    var {title}= req.query;    
    
    res.json(await box.search(title))
})
app.get("/download",async (req,res,next)=>{
    var {title}= req.query;
    var list = title.split(",");
    for(var i in list)
        await box.download(list[i]);
    res.json({})
})
app.get("/add/:code",async (req,res,next)=>{
    var response = await box.download(req.params.code)
    res.json(response)
})

app.listen(3000)