import {commentReplyApiUrl, mobileSpaceUrl, postPageUrl} from "../BiliSpaceLinks";
import {requestOption} from "../BiliSpaceService";
import axios from "axios";

export class BiliCommentExtractor {
    data

    constructor(data) {
        this.data = data
    }

    getName() {
        return this.data.member.uname
    }

    getSubName() {
        return this.data.member.fans_detail && (this.data.member.fans_detail.medal_name + "  Lv."
            + this.data.member.fans_detail.level)
    }

    getTitle() {
        return ""
    }

    getAvatar() {
        return this.data.member.avatar.replace("http://", "https://")
    }

    getUpvoteNum() {
        return this.data.like
    }

    getCommentNum() {
        return this.data.rcount
    }

    getRepostNum() {
        return null
    }

    getImages() {
        return null
    }

    getPrefix() {
        return this.data.member.user_sailing?.cardbg?.fan?.name && (this.data.member.user_sailing?.cardbg?.fan?.name
            + " #" + this.data.member.user_sailing?.cardbg?.fan?.num_desc)
    }

    getPubTime() {
        return this.data.ctime * 1000
    }

    getRefPost() {
        return null
    }

    getContent() {
        return this.data.content.message
    }

    getPreviewReplies() {
        let result = this.data.replies || []
        result.hasMore = () => this.data.rcount > result.length
        result.getLastID = () => result[result.length-1].rpid_str
        for (let item of result) {
            item.getIdentifyID = ()=> item.rpid_str
            item.url = undefined
            item.getTime = () => item.ctime * 1000
        }
        return result
    }

    getID() {
        return this.data.rpid_str
    }

    getReplies(pn, parentID, parentType){
        let requestUrl = commentReplyApiUrl + `${parentID}&type=${parentType===2?11:17}&pn=${pn}&root=${this.getID()}`
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
        return ""
    }
    getIdentifyName(){
        return this.data.mid
    }
    getType(){
        return null
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