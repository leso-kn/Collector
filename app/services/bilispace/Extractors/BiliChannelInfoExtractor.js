import {requestOption} from "../BiliSpaceService";
import axios from "axios";

export class BiliChannelInfoExtractor {
    data

    constructor(data) {
        this.data = data.item
    }

    getInfo(){
        return this.data.usign
    }
    getName(){
        return this.data.uname
    }
    getAvatar(){
        return "https:" + this.data.upic
    }
    getIdentifyName(){
        return this.data.mid
    }
}
