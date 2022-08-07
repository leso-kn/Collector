import axios from "axios";
import {getUserInfoUrl, getUserTwitterApiUrl, twitterUserPageUrl} from "../TwitterLinks";
import {defaultParams, getToken, handleResult} from "../TwitterService";

export class TwitterUserExtractor {
    data
    constructor(url, id, data) {
        if(data){
            this.data = data.data
        }
        id = url.split("twitter.com/")[1].split("/")[0].split("?")[0]
        return (async () => getToken()
            .then(res => axios.get(getUserInfoUrl, {params: {user_id: id}, headers: res}))
            .then(res => {
                this.data = res.data[0]
                return this
            }))()
    }

    getName() {
        return this.data.name
    }

    getAvatar() {
        return this.data.profile_image_url_https
    }

    getFanNum() {
        return this.data.followers_count
    }

    getIdentifyName() {
        return this.data.screen_name
    }

    getFollowNum() {
        return this.data.friends_count
    }

    getInfo() {
        return this.data.description
    }

    getLikeNum() {
        return this.data.favourites_count
    }

    getAdditionalText() {
        return this.data.entities?.url?.urls?.[0]?.display_url
    }

    getHeadImgUrl() {
        return this.data.profile_banner_url
    }

    getHeadImgRatio() {
        return 1 / 3
    }

    getPosts(pn, lastID) {
        const requestParams = {
            ...defaultParams,
            'count': 12,
            'include_tweet_replies': '0',
            "cursor":lastID
        }
        let userID = this.data.id_str
        return getToken().then(res=>
            axios.get(getUserTwitterApiUrl + this.data.id_str + ".json", {params:requestParams, headers: res}))
            .then(res=>handleResult(res, userID, "userOnly"))
    }

    getUrl() {
        return twitterUserPageUrl + this.data.id_str
    }

    getServicePrefix() {
        return "Twitter"
    }

    getIdentifyID() {
        return this.getServicePrefix() + this.getIdentifyName()
    }
}