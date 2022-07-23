import * as BiliSpaceService from "./services/bilispace/BiliSpaceService";
import {themeDefault} from "./constants";
import * as DefaultService from "./services/default/DefaultService";

const availableServices = [
    BiliSpaceService.getBiliSpaceService,
    DefaultService.getDefaultService
]

export const findService = async (url, id, data)=>{
    let availableService = null
    for(let service of availableServices){
        availableService = availableService || await service(url, id, data)
    }
    return availableService
}

export const getCurrentServiceUrl = ()=>{
    return BiliSpaceService.serviceUrl
}
export const getTheme = ()=>{
    return themeDefault
}

