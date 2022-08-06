import {defaultParams, getToken, handleResult} from "../TwitterService";
import {searchTweetApiUrl, twitterUserPageUrl} from "../TwitterLinks";

const axios = require("axios");

export class TwitterSearchExtractor {
    url
    query

    constructor(url) {
        return (async () => {
            this.query = url.split(searchTweetApiUrl)[1]
            this.url = url
            return this
        })() // https://stackoverflow.com/a/50885340
    }

    async getChannels(pn, lastID) {
        const requestParams = {
            ...defaultParams,
            'count': 25,
            'q': this.query,
            'query_source': 'typed_query',
            'pc': '1',
            'spelling_corrections': '1',
            'result_filter': 'user',
            "cursor":lastID
        }
        return getToken()
            .then(res => axios.get(searchTweetApiUrl, {params: requestParams, headers: res}))
            .then(res=>{
                let result = res.data.globalObjects.users
                let returnArray = []
                for(let key in result){
                    let item = result[key]
                    returnArray.push({
                        data:item,
                        url: twitterUserPageUrl + item.id_str,
                        identifyID: "Twitter" + item.id_str
                    })
                }
                let temp
                for(let item of res.data.timeline.instructions){
                    if(item.addEntries){
                        temp = item.addEntries.entries
                    }
                }
                returnArray.hasMore = () => true
                returnArray.getLastID = () => temp[temp.length-1].content.operation.cursor.value
                return returnArray
            })
    }

    async getPosts(pn, lastID) {
        return TwitterSearchExtractor.getPostsImpl(this.query, true, lastID)
    }

    static async getPostsImpl(query, mode, cursor, maxId) {
        const requestParams = {
            ...defaultParams,
            'count': 12,
            'cursor': cursor,
            'max_id': maxId,
            'q': query,
            'query_source': 'typed_query',
            'pc': '1',
            'tweet_search_mode': mode,
            'spelling_corrections': '1',
        }
        return getToken()
            .then(res => axios.get(searchTweetApiUrl, {params: requestParams, headers: res}))
            .then(res => handleResult(res, 0))
    }
}