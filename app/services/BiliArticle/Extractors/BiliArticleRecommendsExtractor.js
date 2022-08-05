import axios from "axios";
import {articlePageUrl, trendingApiUrl} from "../BiliArticleLinks";

export class BiliArticleRecommendsExtractor{
    url
    constructor(url) {
        this.url = url
        return this
    }
    getPosts(pn){
        return axios.get(this.url + `&pn=${pn}`).then(res=>{
            let result = res.data.data || []
            result.hasMore = () => this.url.includes(trendingApiUrl)?false:result.length === 20
            result.getLastID = () => result[result.length-1].id
            for (let item of result) {
                item.getIdentifyID = ()=> "BiliArticle" + item.id
                item.getChannelIdentifyID = ()=>"biliSpace" + item.author.mid
                item.url = articlePageUrl + item.id
                item.getTime = () => item.publish_time * 1000
            }
            return result
        })
    }
}