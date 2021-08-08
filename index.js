var box = new (require("./jukebox"))();
var app = require("express")();
app.get("/",(req,res,next)=>{
    res.json({})
})
app.get("/add/:code",async (req,res,next)=>{
    var response = await box.download(req.params.code)
    res.json(response)
})
app.listen(3000)