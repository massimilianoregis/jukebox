const proxy = require('express-http-proxy');
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
    app.use("/jukebox",require("./service/jukebox"))
    app.use("/",proxy("96e1-2607-fb90-579a-c8f6-122-95bb-541-36d.ngrok.io"));
    app.get("/",(req,res)=>{
        res.redirect('/jukebox/music')
    })    
app.listen(3002)
