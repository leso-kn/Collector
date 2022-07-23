export class DefaultChannelInfoExtractor {
    data

    constructor(data) {
        this.data = data
    }

    getInfo(){
        return this.data.info
    }
    getName(){
        return this.data.name
    }
    getAvatar(){
        return this.data.avatar
    }
    getIdentifyName(){
        return this.data.identifyName
    }
}