import axios from "axios";
import {
    getTokenUrl, mobileTweetPageRegexUrl,
    mobileTwitterUserPageUrl,
    searchTweetApiUrl,
    tweetPageRegexUrl,
    twitterUserPageUrl
} from "./TwitterLinks";
import {TwitterPostExtractor} from "./Extractors/TwitterPostExtractor";
import {TwitterSearchExtractor} from "./Extractors/TwitterSearchExtractor";
import {TwitterUserExtractor} from "./Extractors/TwitterUserExtractor";
import {DefaultChannelInfoExtractor} from "../default/Extractors/DefaultChannelInfoExtractor";

export const defaultParams = {
    'include_profile_interstitial_type': '0',
    'include_blocking': '0',
    'include_blocked_by': '0',
    'include_followed_by': '0',
    'include_mute_edge': '0',
    'include_can_dm': '0',
    'include_can_media_tag': '1',
    'skip_status': '1',
    'cards_platform': 'Web-12',
    'include_cards': '1',
    'include_composer_source': 'false',
    'include_ext_alt_text': 'true',
    'include_reply_count': '1',
    'tweet_mode': 'extended',
    'include_entities': 'true',
    'include_user_entities': 'true',
    'include_ext_media_color': 'false',
    'include_ext_media_availability': 'true',
    'send_error_codes': 'true',
    'simple_quoted_tweet': 'true',
    'ext': 'mediaStats',
    'include_quote_count': 'true'
};

export const getToken = async()=>{
    const token = 'Bearer AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw'
    return axios.post(getTokenUrl,{}, {headers:{'authorization': token}, proxy:false}).then(res=>{
        return {
            'authorization': token,
            'x-guest-token': res.data.guest_token,
            'x-twitter-active-user': 'yes',
            'User-Agent': "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0"
        }
    })
}

export const getTwitterService = async(url, id, data)=>{
    if(url.includes(mobileTwitterUserPageUrl) && !(url.split(mobileTwitterUserPageUrl)[1].split("?")[0].split("/")[1])){
        if(data)return new DefaultChannelInfoExtractor(data)
        return new TwitterUserExtractor(url, id, data)
    }else if(url.includes(twitterUserPageUrl) && !(url.split(twitterUserPageUrl)[1].split("?")[0].split("/")[1])){
        return new TwitterUserExtractor(url, id, data)
    }else if(tweetPageRegexUrl.test(url) || mobileTweetPageRegexUrl.test(url)){
        return new TwitterPostExtractor(url, id, data)
    }else if(url.includes(searchTweetApiUrl)){
        return new TwitterSearchExtractor(url)
    }
}

export const serviceUrls = {
    getSearchPostUrl:(user, query)=>searchTweetApiUrl + query,
    getSearchChannelUrl: (query)=>searchTweetApiUrl + query,
    getTrendingUrls:()=>[]
}
export const getLastID = res=>{
    let temp
    for(let item of res.data.timeline.instructions){
        if(item.addEntries){
            temp = item.addEntries.entries
        }
    }
    return temp[temp.length-1].content.operation?.cursor?.value
}
export const handleResult = (res, userID, type, postIDs)=>{
    let result = res.data.globalObjects
    let returnArray = []
    returnArray.hasMore = () => true
    returnArray.getLastID = () => getLastID(res)
    for (let key in result.tweets) {
        let item = result.tweets[key]
        if(type ==="userOnly" && item.user_id_str !== userID)continue
        if(type === "getComments" && postIDs.includes(item.id_str))continue
        returnArray.push({
            tweetData:item,
            userData: result.users[item.user_id_str],
            getIdentifyID: ()=> "Twitter" + item.id_str,
            getChannelIdentifyID: ()=>"Twitter" +item.user_id_str,
            url:item.in_reply_to_status_id_str?
                twitterUserPageUrl + item.in_reply_to_screen_name + "/status/" + item.in_reply_to_status_id_str :
                twitterUserPageUrl + result.users[item.user_id_str].screen_name + "/status/" + item.id_str,
            getTime: () => item.created_at
        })
    }
    return returnArray.sort((a,b)=>new Date(a.getTime()) < new Date(b.getTime()))
}