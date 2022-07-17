import {PostExtractor} from "./Extractors/postExtractor";
const acceptSpaceUrl = url => url.contains("m.bilibili.com/space")
    || new RegExp("space.bilibili.com/.*/dynamic").test(url)

export const getBiliSpaceService = async(url)=>{
    if(acceptSpaceUrl(url)){
        return await new PostExtractor(url);
    }
    return null;
}