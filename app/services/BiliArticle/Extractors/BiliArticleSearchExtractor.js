import {articlePageUrl} from "../BiliArticleLinks";


const axios = require("axios");

export class BiliArticleSearchExtractor{
    url
    constructor(url) {
        return (async () => {
            this.url = url
            return this
        })() // https://stackoverflow.com/a/50885340
    }
    async getPosts(pn){
        return axios.get(this.url + `&page=${pn}`).then(res=>{
            let result = res.data.data.result || []
            result.hasMore = () => res.data.data.numPages > pn
            result.getLastID = () => result[result.length-1].id
            for (let item of result) {
                item.getIdentifyID = ()=> "BiliArticle" + item.id
                item.getChannelIdentifyID = () => "biliSpace" + item.mid
                item.url = articlePageUrl + item.id
                item.getTime = () => item.pub_time * 1000
            }
            return result
        })
    }
}