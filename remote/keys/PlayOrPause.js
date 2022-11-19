var Command = require("../Command");
class PlayOrPause extends Command{
    keyId="KEY_PLAYPAUSE"
    endpoint='/jukebox/playorpause'
}

module.exports=PlayOrPause