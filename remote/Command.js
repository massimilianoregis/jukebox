class Command{
    keyId="";
    endpoint="";
    listener(keyboard){
        keyboard.on('keypress', ({keyId})=>{if(keyId==this.keyId) this.press()});        
    }
    press(){
        require("./Remote").services.get(this.endpoint)
    }
}

module.exports=Command;