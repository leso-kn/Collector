import {DefaultPostExtractor} from "./Extractors/DefaultPostExtractor";
import {DefaultChannelInfoExtractor} from "./Extractors/DefaultChannelInfoExtractor";

export const getDefaultService = async (url, id, data) => {
    if(id === "defaultPost"){
        return new DefaultPostExtractor(url, id, data)
    }
    return null
}