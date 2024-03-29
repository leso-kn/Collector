import {commentApiUrl, mobileSpaceUrl, postPageUrl, repostApiUrl} from "../BiliSpaceLinks";
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
    4099    综艺      697603783829487618
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
                this.forwardCard = this.contentCard.origin && JSON.parse(this.contentCard.origin)
            }
            return this
        }
        return (async () => await axios.get(url, requestOption).then(res => {
            this.card = res.data.data.card
            this.type = this.card.desc.type
            this.contentCard = JSON.parse(this.card.card)
            if (this.type === 1) {
                this.forwardCard = this.contentCard.origin && JSON.parse(this.contentCard.origin)
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
    } postPageUrl

    getUpvoteNum() {
        return this.card.desc.like
    }

    getCommentNum() {
        switch (this.type){
            case 8:
                return this.contentCard.stat.reply
            default:
                return this.card.desc.comment
        }
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
                if(!this.forwardCard)
                    return this.contentCard.item.content + "\n\n(The origin resource is unavailable)"
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
                if(!this.forwardCard)return null
                let returnCard = {...this.contentCard}
                returnCard.url = postPageUrl + this.card.desc.orig_dy_id_str
                returnCard.type = this.card.desc.origin.type
                returnCard.id = this.card.desc.orig_dy_id_str
                if(returnCard.type === 4099)return ""
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
            case 8:
                return this.card.desc.rid
            default:
                return this.id
        }
    }

    async getComments(pn, sort = 1){
        return BiliPostExtractor.getCommentsImpl(pn, this.type, this.getID(), sort)
    }

    static async getCommentsImpl(pn, type, id, sort=1) {
        let requestUrl, typeCode;
        switch (type){
            case 2:
            case 64:
                typeCode = 11
                break
            case 1:
            case 4:
            case 2048:
                typeCode = 17
                break
            case 8:
                typeCode = 1
                break
            case 12:
                typeCode = 12
                break
            default:
                return null
        }
        requestUrl = commentApiUrl + `type=${typeCode}&oid=${id}&pn=${pn}&sort=${sort}`
        return axios.get(requestUrl, requestOption).then(res=>{
            let result = res.data.data?.replies || []
            result.hasMore = () => res.data.data.page.num * res.data.data.page.size < res.data.data.page.count
            result.getLastID = () => result[result.length - 1].rpid_str
            for (let item of result) {
                item.getIdentifyID = ()=> "biliSpace" +  item.rpid_str
                item.getChannelIdentifyID = ()=>"biliSpace" + item.mid
                item.id = "biliComment"
                item.getTime = () => item.ctime * 1000
                item.parentID = item.oid
                item.parentType = type
            }
            return result
        })
    }
    getHighlightUrl(){
        switch (this.type){
            case 8:
                return {uri: this.contentCard.jump_url.replace("bilibili://video/", "https://www.bilibili.com/video/av").split("/?")[0], showImg:true}
            case 4200:
                return {uri:this.contentCard.slide_link, showImg: true}
            case 64:
                return {uri: `https://www.bilibili.com/read/cv${this.contentCard.id}`, showImg: false}
            case 2048:
                return {uri: this.contentCard.target_url, showImg: true}
            case 1:
                if(this.card.desc.origin.type === 4099){
                    return {uri: this.forwardCard.url, showImg: true}
                }
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
    static async getRepostsImpl(lastID, id){
        return axios.get(repostApiUrl + id + (lastID?`&offset=${lastID}`:""), requestOption).then(res=>{
            let result = res.data.data.items || []
            result.hasMore = () => res.data.data.has_more
            result.getLastID = () => res.data.data.offset
            for (let item of result) {
                item.getIdentifyID = ()=> "biliSpace" + item.desc.dynamic_id_str
                item.getChannelIdentifyID = ()=>"biliSpace" + item.desc.uid
                item.url = postPageUrl + item.desc.dynamic_id_str
                item.getTime = () => item.desc.timestamp*1000
            }
            return result
        })
    }
    getParentID(){
        return null
    }

    getParentType(){
        return null
    }
    getOuterContentURLs(){
        return null
    }
    getHTMLContent(){
        return null
    }
}

