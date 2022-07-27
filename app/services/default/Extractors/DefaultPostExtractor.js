import {BiliPostExtractor} from "../../bilispace/Extractors/BiliPostExtractor";
import {mobileSpaceUrl} from "../../bilispace/BiliSpaceLinks";

export class DefaultPostExtractor{
    data
    constructor(data) {
        this.data = data
        return (async ()=>this)()
    }
    getName(){
        return this.data.name
    }
    getAvatar(){
        return this.data.avatar
    }
    getUpvoteNum(){
        return this.data.upvoteNum
    }
    getCommentNum(){
        return this.data.commentNum
    }
    getRepostNum(){
        return this.data.repostNum
    }
    getImages(){
        return this.data.images
    }
    getPrefix(){
        return this.data.prefix
    }
    getTitle(){
        return this.data.title
    }
    getSubName(){
        return this.data.subname
    }
    getID(){
        return this.data.id
    }
    getPubTime(){
        return this.data.pubtime
    }
    getRefPost(){
        return this.data.refPost
    }
    getContent(){
        return this.data.content
    }
    getHighLightUrl(){
        return this.data.highLightUrl
    }
    getIdentifyName(){
        return this.data.identifyName
    }
    getPreviewReplies(){
        return this.data.replies
    }
    getType(){
        return this.data.type
    }
    async getComments(pn, sort=1){
       return await BiliPostExtractor.getCommentsImpl(pn, this.getType(), this.getID(), sort)
    }
    getIdentifyID(){
        return this.data.identifyID
    }
    getChannelIdentifyID(){
        return this.data.channelIdentifyID
    }
    getChannelUrl(){
        return this.data.channelUrl
    }
}