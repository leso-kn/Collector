import axios from "axios";
import {articlePageUrl, trendingApiUrl} from "../BiliArticleLinks";

export class BiliArticleChannelExtractor {
    url
    constructor(url) {
        this.url = url
    }
    getPosts(pn, lastID){
        return axios.get(this.url).then(res=>{
            let result = res.data.data || []
            result.hasMore = () => this.url.includes(trendingApiUrl)?false:result.length === 20
            result.getLastID = () => result[result.length-1].id
            for(let item of result){
                item.getIdentifyID = ()=>"BiliArticle" + item.id
                item.getChannelIdentifyID = () => "BiliArticle" + item.author.mid
                item.url = articlePageUrl + item.id
                item.getTime = () => item.publish_time
            }
        })
    }
}