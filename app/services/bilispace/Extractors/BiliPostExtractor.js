import {commentApiUrl, mobileSpaceUrl, postApiUrl, postPageUrl} from "../BiliSpaceLinks";
import {shortenLargeNumber} from "../../../utils";
import {requestOption} from "../BiliSpaceService";

const axios = require("axios");

export class BiliPostExtractor {
    url
    id
    data
    card
    forwardCard
    contentCard

    constructor(url, id, data) {
        this.url = url;
        this.id = id;
        if(data){
            this.card = data
            this.type = this.card.desc.type
            this.contentCard = JSON.parse(this.card.card)
            if (this.type === 1) {
                this.forwardCard = JSON.parse(this.contentCard.origin)
            }
            return this
        }
        return (async () => await axios.get(url, requestOption).then(res => {
            this.card = res.data.data.card
            this.type = this.card.desc.type
            this.contentCard = JSON.parse(this.card.card)
            if (this.type === 1) {
                this.forwardCard = JSON.parse(this.contentCard.origin)
            }
            return this
        }))() // https://stackoverflow.com/a/50885340
    }

    getName() {
        switch (this.type) {
            case 1:
                //TODO: Other cases
            case 2:
            case 4:
            default:
                return this.card.desc.user_profile.info.uname
        }
    }

    getAvatar() {
        switch (this.type) {
            case 1:
            case 2:
            case 4:
            default:
                return this.card.desc.user_profile.info.face
        }
    }

    getSubName() {
        return null
    }

    getUpvoteNum() {
        return this.card.desc.like
    }

    getCommentNum() {
        return this.card.desc.comment
    }

    getRepostNum() {
        return this.card.desc.repost
    }

    getPrefix() {
        return shortenLargeNumber(Number(this.card.desc.view)) + " Views"
    }

    getContent() {
        //TODO: embedded emojis, @ to user
        switch (this.type) {
            case 1:
            case 4:
                return this.contentCard.item.content
            case 2:
                return this.contentCard.item.description
            case 8:
            case 64:
                return this.contentCard.dynamic
            case 2048:
                return this.contentCard.vest.content
            default:
                return ""
        }
    }

    getImages() {
        let imgList = []
        switch (this.type) {
            case 2:
                for (let item of this.contentCard.item.pictures) {
                    imgList.push({uri: item.img_src})
                }
                return imgList
            // case 4200:
            //     return [{uri:this.contentCard.cover}]
            default:
                return ""
        }
    }

    getTitle() {
        switch (this.type){
            case 4200:
                return this.contentCard.title
            default:
                return ""
        }
    }

    getPubTime() {
        return this.card.desc.timestamp * 1000
    }

    getRefPost() {
        switch (this.type) {
            case 1:
                let returnCard = {...this.contentCard}
                returnCard.url = postPageUrl + this.card.desc.orig_dy_id_str
                returnCard.type = this.card.desc.origin.type
                returnCard.id = this.card.desc.orig_dy_id_str
                return returnCard
            default:
                return ""
        }
    }

    getID() {
        switch (this.type){
            case 2:
            case 64:
                return this.card.desc.rid_str
            default:
                return this.id
        }
    }

    getPreviewReplies() {
        return null
    }
    async getComments(pn, sort = 1){
        return BiliPostExtractor.getCommentsImpl(pn, this.type, this.getID(), sort)
    }

    static async getCommentsImpl(pn, type, id, sort=1) {
        let requestUrl;
        switch (type){
            case 2:
            case 64:
                requestUrl = commentApiUrl + `type=11&oid=${id}&pn=${pn}&sort=${sort}`
                break
            case 1:
            case 4:
            case 2048:
                requestUrl = commentApiUrl + `type=17&oid=${id}&pn=${pn}&sort=${sort}`
                break
            default:
                return null
        }
        //console.log(requestUrl)
        return axios.get(requestUrl, requestOption)
    }
    getHighLightUrl(){
        switch (this.type){
            case 8:
                return this.contentCard.jump_url.replace("bilibili://video/", "https://www.bilibili.com/video/av").split("/?")[0]
            case 4200:
                return this.contentCard.slide_link
            case 64:
                return `https://www.bilibili.com/read/cv${this.contentCard.id}`
            case 2048:
                return this.contentCard.target_url
            default:
                return ""
        }
    }
    getIdentifyName(){
        return this.card.desc.uid
    }
    getType(){
        return this.type
    }
    getServicePrefix(){
        return "biliSpace"
    }
    getIdentifyID(){
        return this.getServicePrefix() +  this.getID()
    }
    getChannelIdentifyID(){
        return "biliSpace" + this.getIdentifyName()
    }
    getChannelUrl(){
        return mobileSpaceUrl + this.getIdentifyName()
    }
}

