import {BiliPostExtractor} from "./BiliPostExtractor";
import {shortenLargeNumber} from "../../../utils";
import {mobileSpaceUrl} from "../BiliSpaceLinks";

export class BiliRefPostExtractor {
    data
    type
    rawData
    rp_id
    constructor(data) {
        this.rawData = data
        this.data = JSON.parse(data.origin)
        this.type = data.type
        this.rp_id = data.rp_id
        return (async () => this)()
    }

    getName() {
        switch (this.type) {
            case 8:
                return this.data.owner.name
            case 2:
                return this.data.user.name
            case 4:
                return this.data.user.uname
            case 64:
                return this.data.author.name
            default:
                return this.rawData.origin_user.info.uname
        }

    }

    getAvatar() {
        switch (this.type) {
            case 8:
                return this.data.owner.face
            case 2:
                return this.data.user.head_url
            case 4:
                return this.data.user.face
            case 64:
                return this.data.author.face
            default:
                return this.rawData.origin_user.info.face
        }

    }

    getUpvoteNum() {
        switch (this.type) {
            case 8:
                return this.data.stat.like
            case 64:
                return this.data.stats.like
            default:
                return this.data.item.like
        }
    }

    getCommentNum() {
        switch (this.type) {
            case 8:
                return this.data.stat.reply
            case 64:
                return this.data.stats.reply
            default:
                return this.data.item.reply
        }
    }

    getRepostNum() {
        switch (this.type) {
            case 8:
                return this.data.stat.share
            case 64:
                return this.data.stats.share
            default:
                return this.data.item.share
        }
    }

    getImages() {
        switch (this.type) {
            case 2:
                return this.data.item.pictures?.map(x => {
                    return {uri: x.img_src}
                })
            default:
                return null
        }
    }

    getPrefix() {
        switch (this.type) {
            case 8:
                return shortenLargeNumber(Number(this.data.stat.view)) + " Views"
            case 64:
                return shortenLargeNumber(Number(this.data.stats.view)) + " Views"
            default:
                return this.data.item.view && shortenLargeNumber(Number(this.data.item.view)) + " Views"
        }

    }

    getTitle() {
        switch (this.type) {
            case 8:
            case 64:
                return this.data.title
            default:
                return this.data.item.title
        }

    }

    getSubName() {
        return ""
    }

    getPubTime() {
        switch (this.type) {
            case 8:
                return this.data.pubdate
            case 64:
                return this.data.publish_time
            case 2:
                return this.data.item.upload_time * 1000
            default:
                return this.data.item.timestamp * 1000
        }
    }

    getRefPost() {
        return null
    }

    getContent() {
        switch (this.type) {
            case 8:
            case 64:
                return this.data.dynamic
            case 2:
                return this.data.item.description
            case 4:
            case 1:
                return this.data.item.content
            case 2048:
                return this.data.vest.content
            default:
                return ""

        }
    }

    getHighLightUrl() {
        switch (this.type) {
            case 8:
                return this.data.short_link
            case 4200:
                return this.data.slide_link
            case 64:
                return `https://www.bilibili.com/read/cv${this.data.id}`
            case 2048:
                return this.data.target_url
            default:
                return null
        }
    }

    getIdentifyName() {
        switch (this.type) {
            case 8:
                return this.data.owner.mid
            default:
                return this.rawData.origin_user.info.uid
        }

    }

    getPreviewReplies() {
        return null
    }

    getType() {
        return this.rawData.item.orig_type
    }

    async getComments(pn, sort = 1) {
        return BiliPostExtractor.getCommentsImpl(pn, this.getType(), this.getID(), sort)
    }

    getID() {
        switch (this.type){
            case 2:
            case 64:
                return this.rp_id
            case 8:
                return this.data.aid
            default:
                return this.rawData.id
        }
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