import axios from "axios";
import {requestOption} from "../../bilispace/BiliSpaceService";
import {postPageUrl} from "../../bilispace/BiliSpaceLinks";
import * as rssParser from "react-native-rss-parser";

export class RSSSourceExtractor {
    data
    url

    constructor(url, id, data) {
        return (async () => await axios.get(url).then(res=>rssParser.parse(res.data)).then(res=>{
            this.data = res
            return this
        }))()
    }

    getInfo() {
        return this.data.description
    }

    getAdditionalText() {
        return `Last update: ${this.data.lastPublished || this.data.lastUpdated}`
    }

    getName() {
        return this.data.title
    }

    getAvatar() {
        return this.data.image.url
    }

    getFanNum() {
        return null
    }

    getFollowNum() {
        return null
    }

    getLikeNum() {
        return null
    }

    getHeadImgUrl() {
        return null
    }

    getHeadImgRatio() {
        return null
    }

    getIdentifyName() {
        return this.data.originURL
    }

    getServicePrefix() {
        return "RSS"
    }

    getIdentifyID() {
        return this.getServicePrefix() + this.getIdentifyName()
    }

    getUrl() {
        return this.url
    }

    getPosts() {
        let result = this.data.items
        result.hasMore = () => false
        result.getLastID = () => null
        for (let item of result) {
            item.getIdentifyID = ()=> "RSS" + item.id
            item.getChannelIdentifyID = ()=> "RSS" + this.url
            item.url = "RSSItem"
            item.avatar = this.data.image.url
            item.getTime = () => item.published
        }
        return result
    }
}