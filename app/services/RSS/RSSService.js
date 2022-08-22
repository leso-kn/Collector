import {RSSSourceExtractor} from "./Extractors/RSSSourceExtractor";
import {DefaultChannelInfoExtractor} from "../default/Extractors/DefaultChannelInfoExtractor";
import {RSSItemExtractor} from "./Extractors/RSSItemExtractor";

export const getRSSService = async (url, id, data) => {
    if(id === "RSSSource"){
        if(data)return new DefaultChannelInfoExtractor(data)
        return new RSSSourceExtractor(url, id, data)
    }else if(url === "RSSItem"){
        return new RSSItemExtractor(url, id ,data)
    }
    return null
}