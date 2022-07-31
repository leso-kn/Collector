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

    /*
    Types:
    1 	转发动态 	355295470145652823
    2 	相册投稿 	351782199784737587
    4 	文字动态 	371794999330051793
    8 	视频投稿 	355292278981797225
    16 	VC小视频投稿
    64 	专栏投稿 	334997154054634266
    128 	？
    256 	音频投稿 	352216850471547670
    512 	番剧更新 	433040940915592171
    1024 	？
    2048 	分享歌单 	325805722180163707
    4200    直播
    4300 	（只能被转发，不能单独查询）视频收藏夹 	485549634823272700
    */

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
                returnCard.rp_id = this.card.desc.origin.rid_str
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
        return axios.get(requestUrl, requestOption).then(res=>{
            let result = res.data.data.replies || []
            result.hasMore = () => res.data.data.page.num * res.data.data.page.size < res.data.data.page.count
            result.getLastID = () => res.data.data.replies[res.data.data.replies.length - 1].rpid_str
            for (let item of result) {
                item.getIdentifyID = ()=> item.rpid_str
                item.url = undefined
                item.getTime = () => item.ctime * 1000
            }
            return result
        })
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

