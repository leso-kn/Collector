import {BiliPostExtractor} from "./BiliPostExtractor";
import {shortenLargeNumber} from "../../../utils";
import {mobileSpaceUrl} from "../BiliSpaceLinks";

export class BiliRefPostExtractor {
    data
    type

    constructor(data) {
        this.data = data
        this.type = this.data.type
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
        }

    }

    getUpvoteNum() {
        switch (this.type) {
            case 8:
                return this.data.stat.like
            default:
                return null
        }
    }

    getCommentNum() {
        switch (this.type) {
            case 8:
                return this.data.stat.reply
            default:
                return this.data.item.reply
        }
    }

    getRepostNum() {
        switch (this.type) {
            case 8:
                return this.data.stat.share
            default:
                return null
        }
    }

    getImages() {
        switch (this.type) {
            case 8:
                return null
            default:
                return this.data.item.pictures?.map(x => {
                    return {uri: x.img_src}
                })
        }
    }

    getPrefix() {
        switch (this.type) {
            case 8:
                return shortenLargeNumber(Number(this.data.stat.view)) + " Views"
            default:
                return null
        }

    }

    getTitle() {
        switch (this.type) {
            case 8:
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
                return this.data.desc
            case 2:
                return this.data.item.description
            case 4:
                return this.data.item.content
        }
    }

    getHighLightUrl() {
        switch (this.type) {
            case 8:
                return this.data.short_link
            default:
                return null
        }
    }

    getIdentifyName() {
        switch (this.type) {
            case 8:
                return this.data.owner.mid
            default:
                return this.data.user.uid
        }

    }

    getPreviewReplies() {
        return null
    }

    getType() {
        return this.data.type
    }

    async getComments(pn, sort = 1) {
        return BiliPostExtractor.getCommentsImpl(pn, this.getType(), this.getID(), sort)
    }

    getID() {
        return this.data.id
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