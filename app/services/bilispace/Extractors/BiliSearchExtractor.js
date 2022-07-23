import {requestOption} from "../BiliSpaceService";

const axios = require("axios");

export class BiliSearchExtractor{
    url
    constructor(url) {
        return (async () => {
            this.url = url
            return this
        })() // https://stackoverflow.com/a/50885340
    }
    async getResults(pn){
        return await axios.get(this.url.replace("page=0", `page=${pn}`), requestOption).then(res => {
            let result = res.data.data.result
            for(let item of result){
                item.url = "biliUserInfo"
            }
            result.hasMore = ()=>res.data.data.numPages !== res.data.data.page
            return result
        })
    }
}