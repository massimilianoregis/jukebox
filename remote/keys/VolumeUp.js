var Command = require("../Command");
class VolumeUp extends Command{
    keyId="KEY_VOLUMEUP"
    endpoint='/jukebox/volume/up'
}
module.exports=VolumeUp