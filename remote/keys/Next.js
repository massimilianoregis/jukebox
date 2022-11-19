var Command = require("../Command");
class Next extends Command{
    keyId="KEY_NEXTSONG"
    endpoint='/jukebox/next'
}

module.exports=Next