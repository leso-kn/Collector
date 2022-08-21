import axios from "axios";
import {getFullTweetApiUrl, twitterUserPageUrl} from "../TwitterLinks";
import {defaultParams, getLastID, getToken, handleResult} from "../TwitterService";

export class TwitterPostExtractor{
    data
    url
    id
    tweetData
    userData
    comments
    constructor(url, id, data) {
        this.url = url
        if(data){
            this.tweetData = data.tweetData
            this.userData = data.userData
            return this
        }
        else {
            let requestParams = {
                ...defaultParams,
                'include_tweet_replies': '1',
                'include_want_retweets': '1',
            };
            id = this.url.split('/')[this.url.split('/').length - 1].split("?")[0]
            return (async () => await getToken()
                .then(res=>axios.get(getFullTweetApiUrl + id + ".json", {params: requestParams, headers: res}))
                .then(res=>{
                    this.comments = res
                    this.tweetData = res.data.globalObjects.tweets[id]
                    this.userData = res.data.globalObjects.users[this.tweetData.user_id_str]
                    return this
                }))()
        }
    }
    getServicePrefix(){
        return "Twitter"
    }
    getName(){
        return this.userData.name
    }
    getAvatar(){
        return this.userData.profile_image_url_https
    }
    getSubName(){
        return "@" + this.userData.screen_name
    }
    getIdentifyName(){
        return this.userData.screen_name
    }
    getChannelIdentifyID(){
        return "Twitter" + this.getIdentifyName()
    }
    getChannelUrl(){
        return twitterUserPageUrl + this.userData.id_str
    }
    getUpvoteNum(){
        return this.tweetData.favorite_count
    }
    getCommentNum(){
        return this.tweetData.reply_count
    }
    getRepostNum(){
        return this.tweetData.retweet_count
    }
    getPrefix() {
        return null
    }
    getPubTime(){
        return this.tweetData.created_at
    }
    getTitle(){
        return null
    }
    getContent(){
        return this.tweetData.full_text
    }
    getImages(){
        return this.tweetData.extended_entities?.media?.map(x=>{return {uri:x.media_url_https}})
    }
    getVideo(){
        return this.tweetData.extended_entities?.media?.[0]?.video_info?.variants?.[0]?.url
    }
    getHTMLContent(){
        return null
    }
    getHighlightUrl(){
        return null
    }
    getRefPost(){
        return null
    }
    getType(){
        return null
    }
    getID(){
        return this.tweetData.id_str
    }
    getIdentifyID(){
        return this.getServicePrefix() + this.getID()
    }
    getParentID(){
        return this.tweetData.in_reply_to_status_id_str
    }
    getParentType(){
        return null
    }
    async getReplies(pn, lastID){
        return TwitterPostExtractor.getCommentsImpl(this.getID(), this.getParentID(), lastID)
    }
    async getComments(pn, lastID){
        if(this.comments && !lastID){
            let temp = this.comments
            this.comments = null
            return handleResult(temp, undefined, "getComments", [this.getID()])
        }
        return TwitterPostExtractor.getCommentsImpl(this.getID(), this.getParentID(), lastID)
    }
    static async getCommentsImpl(ID, parentID, lastID){
        let requestParams = {
            ...defaultParams,
            'include_tweet_replies': '1',
            'include_want_retweets': '1',
            cursor:lastID
        };
        let newLastID, token
        return getToken()
            .then(res=> {
                token = res
               return axios.get(getFullTweetApiUrl+ ID + ".json", {headers: res,  params:requestParams})
            })
            .then(res=> {
                newLastID = getLastID(res)
                return handleResult(res, undefined, "getComments", parentID ? [ID, parentID] : [ID])
            })
            .then(res=>{
                if(!lastID && !res.length && newLastID){
                    requestParams.cursor = newLastID
                    return axios.get(getFullTweetApiUrl+ ID + ".json", {headers: token,  params:requestParams})
                        .then(res=>handleResult(res, undefined, "getComments", parentID ? [ID, parentID] : [ID]))
                }
                return res
            })
    }
    getReposts(){
        return null
    }
}