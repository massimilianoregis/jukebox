require("./util/hash")
var path = require("path")
const services = require("axios").create();

var app = require("express")();
    app.use((req,res,next)=>{
        req.hateous=(value)=>`http://${req.get('host')}${path.resolve(req.originalUrl,value)}`
        req.services={
            get:async (value)=>(await services.get(req.hateous(value))).data
        }
        
        next();
    })
    app.get("/",(req,res)=>{
        res.redirect('/jukebox/music')
    })
    app.use("/jukebox",require("./service/jukebox"))
app.listen(3002)
