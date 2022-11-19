var Command = require("../Command");
class PlayOrPause extends Command{
    keyId="KEY_MUTE"
    endpoint='/jukebox/volume/0'
}

module.exports=PlayOrPause