import {commentApiUrl, postApiUrl, postPageUrl} from "../BiliSpaceLinks";
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

    constructor(url, id) {
        this.url = url;
        this.id = id;
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
                return this.card.desc.user_profile.info.uname
            default:
                return this.card.user.uname
        }
    }

    getAvatar() {
        switch (this.type) {
            case 1:
            case 2:
            case 4:
                return this.card.desc.user_profile.info.face
            default:
                return this.card.user.face
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
            default:
                return ""
        }
    }

    getTitle() {
        return ""
    }

    getPubTime() {
        return new Date(this.card.desc.timestamp * 1000)
    }

    getRefPostUrl() {
        switch (this.type) {
            case 1:
                return postPageUrl + this.card.desc.orig_dy_id_str
            default:
                return ""
        }
    }

    getID() {
        return this.id
    }

    getPreviewReplies() {
        return null
    }

    async getComments(pn, sort=1) {
        let requestUrl;
        switch (this.type){
            case 2:
                requestUrl = commentApiUrl + `type=11&oid=${this.card.desc.rid_str}&pn=${pn}&sort=${sort}`
                break
            case 1:
            case 4:
                requestUrl = commentApiUrl + `type=17&oid=${this.id}&pn=${pn}&sort=${sort}`
        }
        return axios.get(requestUrl, requestOption)
    }
}

