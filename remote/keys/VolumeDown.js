var Command = require("../Command");
class VolumeDown extends Command{
    keyId="KEY_VOLUMEDOWN"
    endpoint='/jukebox/volume/down'
}
module.exports=VolumeDown