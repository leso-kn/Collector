import {commentReplyApiUrl} from "../BiliSpaceLinks";
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
        return new Date(this.data.ctime * 1000)
    }

    getRefPostUrl() {
        return null
    }

    getContent() {
        return this.data.content.message
    }

    getPreviewReplies() {
        return this.data.replies?this.data.replies:[]
    }

    getID() {
        return this.data.rpid_str
    }

    getReplies(pn, parentID){
        let requestUrl = commentReplyApiUrl + `${parentID}&type=17&pn=${pn}&root=${this.getID()}`
        return axios.get(requestUrl, requestOption)
    }
}