import {requestOption} from "../BiliSpaceService";
import {postPageUrl, searchApiUrl} from "../BiliSpaceLinks";

const axios = require("axios");

export class BiliSearchExtractor{
    url
    constructor(url) {
        return (async () => {
            this.url = url
            return this
        })() // https://stackoverflow.com/a/50885340
    }
    async getChannels(pn){
        return await axios.get(this.url.replace("page=0", `page=${pn}`), requestOption).then(res => {
            let result = res.data.data.result
            for(let item of result){
                item.url = "biliUserInfo"
                item.identifyID = "biliSpace" + item.mid
            }
            result.hasMore = ()=>res.data.data.numPages !== res.data.data.page
            result.getLastID = ()=>""
            return result
        })
    }
    async getPosts(pn){
        let channelName = this.url.split("mid=")[1].split("&keyword=")[0]
        if(!channelName)return null
        return axios.get(searchApiUrl + channelName, requestOption).then(res=>{
            return axios.get(this.url.replace(channelName, res.data.data.result[0].mid) + `&pn=${pn}`)
        }).then(res=>{
            let result = res.data.data.cards || []
            result.hasMore = () => true
            result.getLastID = () => res.data.data.cards[res.data.data.cards.length - 1].desc.dynamic_id_str
            for (let item of result) {
                item.getIdentifyID = ()=> "biliSpace" + item.desc.dynamic_id_str
                item.getChannelIdentifyID = () => "biliSpace" + item.desc.uid
                item.url = postPageUrl + item.desc.dynamic_id_str
                item.getTime = () => item.desc.timestamp * 1000
            }
            return result
        })
    }
}