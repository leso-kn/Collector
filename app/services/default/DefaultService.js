import {DefaultChannelInfoExtractor} from "./Extractors/DefaultChannelInfoExtractor";

export const getDefaultService = async (url, id, data) => {
    if(url === "defaultChannelInfo"){
        return new DefaultChannelInfoExtractor(data)
    }
    return null
}