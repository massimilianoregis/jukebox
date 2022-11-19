var Command = require("../Command");
class PlayOrPause extends Command{
    keyId="KEY_PREVIOUSSONG"
    endpoint='/jukebox/playorpause'
}

module.exports=PlayOrPause