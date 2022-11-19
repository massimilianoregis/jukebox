const Remote = require("./remote");

class Command{
    keyId="";
    endpoint="";
    listener(keyboard){
        keyboard.on('keypress', ({keyId})=>{if(keyId==this.keyId) this.press()});
    }
    press(){
        console.log(this.constructor.name)
        Remote.services.get(this.endpoint)
    }
}

module.exports=Command;