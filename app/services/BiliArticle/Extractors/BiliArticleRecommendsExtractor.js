import axios from "axios";
import {requestOption} from "../../bilispace/BiliSpaceService";
import {postPageUrl} from "../../bilispace/BiliSpaceLinks";
import {articlePageUrl} from "../BiliArticleLinks";

export class BiliArticleRecommendsExtractor{
    url
    constructor(url) {
        this.url = url
        return this
    }
    getPosts(){
        return axios.get(this.url, requestOption).then(res=>{
            let result = res.data.data || []
            result.hasMore = () => result.length === 20
            result.getLastID = () => result[result.length-1].id
            for (let item of result) {
                item.getIdentifyID = ()=> "BiliArticle" + item.id
                item.getChannelIdentifyID = ()=>"biliSpace" + item.author.mid
                item.url = articlePageUrl + "cv" + item.id
                item.getTime = () => item.ctime * 1000
            }
        })
    }
}