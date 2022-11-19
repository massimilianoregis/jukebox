var Command = require("../Command");
class PlayOrPause extends Command{
    keyId="KEY_BACK"
    endpoint='/jukebox/playorpause'
}

module.exports=PlayOrPause