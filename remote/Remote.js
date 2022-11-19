const ExclusiveKeyboard = require('exclusive-keyboard');
const Command = require('./Command');
const {PlayOrPause,VolumeUp,VolumeDown,Mute} = require('./keys');


class Remote{
    constructor(name,services){
        this.keyboard = new ExclusiveKeyboard(name, true);
this.keyboard.on('keyup', console.log);
this.keyboard.on('keydown', console.log);
this.keyboard.on('keypress', console.log);
this.keyboard.on('close', console.log);
this.keyboard.on('error', console.error);
    }
    addKey(cmd){
        cmd.listener(this.keyboard);
    }

    default(){
        this.addKey(new PlayOrPause());
        this.addKey(new VolumeUp());
        this.addKey(new VolumeDown());
        this.addKey(new Mute());
        this.addKey(new Next());
        return this;
    }
}

module.exports=Remote;