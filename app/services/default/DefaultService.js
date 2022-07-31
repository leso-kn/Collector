import {DefaultPostExtractor} from "./Extractors/DefaultPostExtractor";

export const getDefaultService = async (url, id, data) => {
    if(id === "defaultPost"){
        return new DefaultPostExtractor(url, id, data)
    }
    return null
}