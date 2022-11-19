const ExclusiveKeyboard = require('exclusive-keyboard');
const Command = require('./Command');
const {PlayOrPause,VolumeUp,VolumeDown} = require('./keys');


class Remote{
    constructor(name,services){
        Command.services=services;
        this.keyboard = new ExclusiveKeyboard(name, true);
    }
    addKey(cmd){
        cmd.listener(this.keyboard);
    }

    default(){
        this.addKey(new PlayOrPause());
        this.addKey(new VolumeUp());
        this.addKey(new VolumeDown());
        return this;
    }
}

module.exports=Remote;