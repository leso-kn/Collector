import {BiliPostExtractor} from "./Extractors/BiliPostExtractor";
import {postApiUrl, postPageUrl,spaceApiUrl} from "./BiliSpaceLinks";
import {BiliCommentExtractor} from "./Extractors/BiliCommentExtractor";
const acceptSpaceUrl = url => url.includes("m.bilibili.com/space")
    || new RegExp("space.bilibili.com/.*/dynamic").test(url)

export const getBiliSpaceService = async(url, id, data)=>{

    if(url.includes(postPageUrl)){
        id = url.split(postPageUrl)[1].split("?")[0]
        return new BiliPostExtractor(postApiUrl + id, id);
    }
    else if(url === "biliComment" && data){
        return new BiliCommentExtractor(data)
    }
    if(acceptSpaceUrl(url)){
        if(url.includes("m.bilibili.com/space")){
           id = url.split("space/")[1].split("?")[0]
        }
        else{
          id = url.split("space.bilibili.com/")[1].split("/")[0]
        }
        return await new BiliPostExtractor(spaceApiUrl + id, id);
    }
    return null;
}
export const requestOption = {
    proxy: false
}