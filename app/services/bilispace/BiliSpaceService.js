import {BiliPostExtractor} from "./Extractors/BiliPostExtractor";
import {
    mobilePostPageUrl,
    mobileSpaceUrl,
    PCSpaceRegUrl,
    postApiUrl,
    postPageUrl,
    searchApiUrl, searchPostApiUrl,
    trendingApiUrl,
    userInfoApiUrl
} from "./BiliSpaceLinks";
import {BiliCommentExtractor} from "./Extractors/BiliCommentExtractor";
import {BiliChannelExtractor} from "./Extractors/BiliChannelExtractor";
import {BiliChannelInfoExtractor} from "./Extractors/BiliChannelInfoExtractor";
import {BiliSearchExtractor} from "./Extractors/BiliSearchExtractor";
import {DefaultChannelInfoExtractor} from "../default/Extractors/DefaultChannelInfoExtractor";
import {BiliRefPostExtractor} from "./Extractors/BiliRefPostExtractor";

const acceptSpaceUrl = url => url.includes()
    || new RegExp("space.bilibili.com/.*/dynamic").test(url)

export const getBiliSpaceService = async (url, id, data) => {
    if (url.includes(postPageUrl)) {
        if(id === "biliRefPost")
            return new BiliRefPostExtractor(data)
        if (id === "biliComment" && data) {
            return new BiliCommentExtractor(data)
        }
        id = url.split(postPageUrl)[1].split("?")[0]
        return new BiliPostExtractor(postApiUrl + id, id, data);
    } else if(url.includes(mobilePostPageUrl)){
        id = url.split(mobilePostPageUrl)[1].split("?")[0]
        return new BiliPostExtractor(postApiUrl + id, id, data);
    }else if(url.includes("https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/unlogin_dynamics?")){
        return new BiliChannelExtractor(url)
    } else if (url.includes(mobileSpaceUrl)) {
        if(data)return new DefaultChannelInfoExtractor(data)
        id = url.split(mobileSpaceUrl)[1].split("?")[0]
        return new BiliChannelExtractor(userInfoApiUrl + id, id)
    } else if (new RegExp(PCSpaceRegUrl).test(url)) {
        id = url.split("/dynamic")[0].split(".com/")[1]
        return new BiliChannelExtractor(userInfoApiUrl + id, id)
    } else if (url.includes(searchApiUrl) && !url.endsWith("&")) {
        return new BiliSearchExtractor(url)
    }else if(url.includes(searchPostApiUrl)){
        return new BiliSearchExtractor(url)
    } else if (url === "biliUserInfo" && data) {
        return new BiliChannelInfoExtractor(data)
    }
    return null;
}
export const requestOption = {
    "Referer":"https://t.bilibili.com/",
    'User-Agent': "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0"
}
export const BiliHeadImgHeightPercentage = 1 / 6.4

export const serviceUrl = {
    getSearchUrl:(query)=>searchApiUrl + `${query}&page=0`,
    getTrendingUrls: ()=>[{label:"Trending", url: trendingApiUrl.replace("1093762", Math.floor(Math.random() * 1000000 + 500000))}],
    getSearchPostUrl: (user, query)=> {
        return searchPostApiUrl + user + `&keyword=${query}`
    }
}