import {BiliPostExtractor} from "./Extractors/BiliPostExtractor";
import {
    mobileSpaceUrl,
    PCSpaceRegUrl,
    postApiUrl,
    postPageUrl,
    searchApiUrl,
    spaceApiUrl, trendingApiUrl,
    userInfoApiUrl
} from "./BiliSpaceLinks";
import {BiliCommentExtractor} from "./Extractors/BiliCommentExtractor";
import {BiliChannelExtractor} from "./Extractors/BiliChannelExtractor";
import {BiliChannelInfoExtractor} from "./Extractors/BiliChannelInfoExtractor";
import {BiliSearchExtractor} from "./Extractors/BiliSearchExtractor";

const acceptSpaceUrl = url => url.includes()
    || new RegExp("space.bilibili.com/.*/dynamic").test(url)

export const getBiliSpaceService = async (url, id, data) => {
    if (url.includes(postPageUrl)) {
        id = url.split(postPageUrl)[1].split("?")[0]
        return new BiliPostExtractor(postApiUrl + id, id);
    } else if(url.includes(trendingApiUrl)){
        return new BiliChannelExtractor(url.replace("1093762",  Math.floor(Math.random()*1000000 + 500000)))
    } else if (url === "biliComment" && data) {
        return new BiliCommentExtractor(data)
    } else if (url.includes(mobileSpaceUrl)) {
        id = url.split(mobileSpaceUrl)[1].split("?")[0]
        return new BiliChannelExtractor(userInfoApiUrl + id, id)
    } else if (new RegExp(PCSpaceRegUrl).test(url)) {
        id = url.split("/dynamic")[0].split(".com/")[1]
        return new BiliChannelExtractor(userInfoApiUrl + id, id)
        // return new BiliChannelExtractor(PCSpaceRegUrl.replace(".*", id), id)
    } else if (url.includes(searchApiUrl) && !url.endsWith("&")) {
        return new BiliSearchExtractor(url)
    } else if (url === "biliUserInfo" && data) {
        return new BiliChannelInfoExtractor(data)
    }
    return null;
}
export const requestOption = {
    proxy: false
}
export const BiliHeadImgHeightPercentage = 1 / 6.4

export const serviceUrl = {
    searchUrl: searchApiUrl,
    trendingUrl: trendingApiUrl
}