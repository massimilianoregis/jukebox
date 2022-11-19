const ExclusiveKeyboard = require('exclusive-keyboard');
const Command = require('./Command');
const {PlayOrPause,VolumeUp,VolumeDown,Mute,Next} = require('./keys');


class Remote{
    constructor(name,services){
        this.keyboard = new ExclusiveKeyboard(name, true);
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