const proxy = require('express-http-proxy');
require("./util/hash")
var path = require("path")
const services = require("axios").create();
var express = require("express");
var port = 3002
try{    
    const Remote= require('./remote/Remote');
    Remote.services={
        get:async (value)=>{
            (await services.get(`http://localhost:${port}${value}`)).data
        }
    }
    new Remote('event2').default()
}catch(e){console.log(e)}



var app = express();
    app.use((req,res,next)=>{
        req.hateous=(value)=>`http://${req.get('host')}${path.resolve(req.originalUrl,value)}`
        req.services={
            get:async (value)=>(await services.get(req.hateous(value))).data
        }        
        next();
    })
    app.use("/jukebox",require("./service/jukebox"))
    app.use("/",express.static("./ui/build"));
    app.get("/",(req,res)=>{
        res.redirect('/jukebox/music')
    })    
console.log(`jukebox at port: ${port}`)
app.listen(port)
