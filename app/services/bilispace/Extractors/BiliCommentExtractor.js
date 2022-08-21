import {commentReplyApiUrl, mobileSpaceUrl} from "../BiliSpaceLinks";
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

    getID() {
        return this.data.rpid_str
    }

    getReplies(pn, parentID, parentType){
        return BiliCommentExtractor.getRepliesImpl(pn, parentID, parentType, this.getID())
    }

    static getRepliesImpl(pn, parentID, parentType, id){
        let typeCode
        switch (parentType){
            case 2:
                typeCode = 11
                break
            case 8:
                typeCode = 1
                break
            case 12:
                typeCode = 12
                break
            default:
                typeCode = 17
        }
        let requestUrl = commentReplyApiUrl + `${parentID}&type=${typeCode}&pn=${pn}&root=${id}`
        return axios.get(requestUrl, requestOption).then(res=>{
            let result = res.data.data?.replies || []
            result.hasMore = () => res.data.data.page.num * res.data.data.page.size < res.data.data.page.count
            result.getLastID = () => result[result.length - 1].rpid_str
            for (let item of result) {
                item.getIdentifyID = ()=> "biliSpace" + item.rpid_str
                item.getChannelIdentifyID = ()=>"biliSpace" + item.mid
                item.id = "biliComment"
                item.getTime = () => item.ctime * 1000
                item.parentID = "biliComment"
                item.parentType = null
            }
            return result
        })
    }
    getHighlightUrl(){
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
    getParentID(){
        return this.data.parentID
    }

    getParentType(){
        return  this.data.parentType
    }
    getVideo(){
        return null
    }
    getHTMLContent(){
        return null
    }
}