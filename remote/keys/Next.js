var Command = require("../Command");
class PlayOrPause extends Command{
    keyId="KEY_NEXTSONG"
    endpoint='/jukebox/next'
}

module.exports=PlayOrPause