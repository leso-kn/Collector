import {mobileSpaceUrl} from "../BiliSpaceLinks";

export class BiliChannelInfoExtractor {
    data

    constructor(data) {
        this.data = data
    }

    getInfo(){
        return this.data.usign
    }
    getName(){
        return this.data.uname
    }
    getUrl(){
        return mobileSpaceUrl + this.data.mid
    }
    getAvatar(){
        return "https:" + this.data.upic
    }
    getIdentifyName(){
        return this.data.mid
    }
    getServicePrefix(){
        return "biliSpace"
    }
    getIdentifyID(){
        return this.getServicePrefix() +  this.getIdentifyName()
    }
}
