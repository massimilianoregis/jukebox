var Command = require("../Command");
class PlayOrPause extends Command{
    keyId="KEY_PLAYPAUSE"
    endpoint='/jukebox/playorpause'

    listener(keyboard){
        keyboard.on('keydown', ({keyId})=>{if(keyId==this.keyId) this.press()});        
    }
    
}

module.exports=PlayOrPause