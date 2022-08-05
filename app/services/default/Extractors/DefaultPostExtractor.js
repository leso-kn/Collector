import {BiliPostExtractor} from "../../bilispace/Extractors/BiliPostExtractor";
import {BiliCommentExtractor} from "../../bilispace/Extractors/BiliCommentExtractor";

export class DefaultPostExtractor {
    data
    id
    url
    constructor(url, id, data) {
        this.url = url
        this.id = id
        this.data = data
        return (async () => this)()
    }

    getName() {
        return this.data.name
    }

    getAvatar() {
        return this.data.avatar
    }

    getUpvoteNum() {
        return this.data.upvoteNum
    }

    getCommentNum() {
        return this.data.commentNum
    }

    getRepostNum() {
        return this.data.repostNum
    }

    getImages() {
        return this.data.images
    }

    getPrefix() {
        return this.data.prefix
    }

    getTitle() {
        return this.data.title
    }

    getSubName() {
        return this.data.subname
    }

    getID() {
        return this.data.id
    }

    getPubTime() {
        return this.data.pubtime
    }

    getRefPost() {
        return this.data.refPost
    }

    getContent() {
        return this.data.content
    }

    getHighlightUrl() {
        return this.data.highLightUrl
    }

    getIdentifyName() {
        return this.data.identifyName
    }

    getType() {
        return this.data.type
    }

    async getComments(pn, sort = 1) {
        return await BiliPostExtractor.getCommentsImpl(pn, this.getType(), this.getID(), sort)
    }

    async getReplies(pn, parentID, parentType) {
        if(parentID === "biliComment")return null
        return await BiliCommentExtractor.getRepliesImpl(pn, parentID, parentType, this.getID())
    }

    async getReposts(lastID){
        return BiliPostExtractor.getRepostsImpl(lastID, this.url.split(".com/")[1])
    }

    getIdentifyID() {
        return this.data.identifyID
    }

    getChannelIdentifyID() {
        return this.data.channelIdentifyID
    }

    getChannelUrl() {
        return this.data.channelUrl
    }

    getParentID(){
        return this.data.parentID
    }

    getParentType(){
        return this.data.parentType
    }
}