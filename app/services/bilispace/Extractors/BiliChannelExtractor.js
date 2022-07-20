import axios from "axios";
import {requestOption} from "../BiliSpaceService";

export class BiliChannelExtractor {
    data
    card
    constructor(url) {
        return (async () => await axios.get(url, requestOption).then(res => {
            this.data = res.data.data
            this.card = this.data.card
            return this
        }))()
    }
    getName(){
        return this.card.name
    }
    getAvatar(){
        return this.card.face.replace("http", "https")
    }
    getFanNum(){
        return this.card.fans
    }
    getIdentifyName(){
        return this.card.mid
    }
    getFollowNum(){
        return this.card.attention
    }
    getSign(){
        return this.card.sign
    }
    getLikeNum(){
        return this.data.like_num
    }
    getAdditionalText(){
        return this.card.Official.title
    }
    getHeadImgUrl(){
        return this.data.space.l_img
    }
    getHeadImgRatio(){
        return 1/6.4
    }
}