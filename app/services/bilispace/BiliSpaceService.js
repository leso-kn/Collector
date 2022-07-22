import {BiliPostExtractor} from "./Extractors/BiliPostExtractor";
import {
    mobileSpaceUrl,
    PCSpaceRegUrl,
    postApiUrl,
    postPageUrl,
    searchApiUrl,
    spaceApiUrl,
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
    } else if (url === "biliComment" && data) {
        return new BiliCommentExtractor(data)
    } else if (url.includes(mobileSpaceUrl)) {
        id = url.split(mobileSpaceUrl)[1].split("?")[0]
        return new BiliChannelExtractor(userInfoApiUrl + id, id)
    } else if (new RegExp(PCSpaceRegUrl).test(url)) {
        id = url.split("/dynamic")[0].split(".com/")[1]
        return new BiliChannelExtractor(userInfoApiUrl + id, id)
        // return new BiliChannelExtractor(PCSpaceRegUrl.replace(".*", id), id)
    } else if (url.includes(searchApiUrl)) {
        return new BiliSearchExtractor(url)
    } else if (url === "biliUserInfo" && data) {
        return new BiliChannelInfoExtractor(data)
    }
    if (acceptSpaceUrl(url)) {
        if (url.includes("m.bilibili.com/space")) {
            id = url.split("space/")[1].split("?")[0]
        } else {
            id = url.split("space.bilibili.com/")[1].split("/")[0]
        }
        return await new BiliPostExtractor(spaceApiUrl + id, id);
    }
    return null;
}
export const requestOption = {
    proxy: false
}
export const BiliHeadImgHeightPercentage = 1 / 6.4