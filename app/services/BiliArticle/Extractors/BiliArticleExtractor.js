import axios from "axios";
import {articlePageUrl} from "../BiliArticleLinks";
import {shortenLargeNumber} from "../../../utils";
import {mobileSpaceUrl} from "../../bilispace/BiliSpaceLinks";
import {BiliPostExtractor} from "../../bilispace/Extractors/BiliPostExtractor";

export class BiliArticleExtractor{
    data
    authorData
    url
    id
    constructor(url, id, data) {
        this.url = url
        this.id = id?id:url.split(articlePageUrl)[1]

        if(data){
            this.data = data
            this.authorData = this.data.author
            return this
        }
        else {
            return (async () => await axios.get(url).then(res => {
                this.data = JSON.parse(res.data.split("window.__INITIAL_STATE__=")[1].split(";(function()")[0]).readInfo
                this.authorData = this.data.author
                return this
            }))()
        }
    }
    getServicePrefix(){
        return "BiliArticle"
    }
    getName(){
        return this.authorData.name
    }
    getAvatar(){
        return this.authorData.face.replace("http://", "https://")
    }
    getSubName(){
        return null
    }
    getIdentifyName(){
        return this.authorData.mid
    }
    getChannelIdentifyID(){
        return "biliSpace" + this.getIdentifyName()
    }
    getChannelUrl(){
        return mobileSpaceUrl + this.getIdentifyName()
    }
    getUpvoteNum(){
        return this.data.stats.like
    }
    getCommentNum(){
        return this.data.stats.reply
    }
    getRepostNum(){
        return this.data.stats.share
    }
    getPrefix() {
        return shortenLargeNumber(Number(this.data.stats.view)) + " Views"
    }
    getPubTime(){
        return this.data.publish_time * 1000
    }
    getTitle(){
        return this.data.title
    }
    getContent(){
        return null
    }
    getImages(){
        return null
    }
    getOuterContentURLs(){
        return null
    }

    getHTMLContent(){
        return null
    }

    getHighlightUrl(){
        return {uri: articlePageUrl +this.id, showImg: false}
    }
    getRefPost(){
        return null
    }
    getType(){
        return 12
    }
    getID(){
        return this.id
    }
    getIdentifyID(){
        return this.getServicePrefix() + this.getID()
    }
    getParentID(){
        return null
    }
    getParentType(){
        return null
    }
    async getComments(pn, lastID, sort=1){
        return BiliPostExtractor.getCommentsImpl(pn, 12, this.id, sort)
    }
    getReposts(){
        return null
    }
}