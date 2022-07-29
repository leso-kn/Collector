import {DefaultPostExtractor} from "./Extractors/DefaultPostExtractor";

export const getDefaultService = async (url, id, data) => {
    if(id === "defaultPost"){
        return new DefaultPostExtractor(data)
    }
    return null
}