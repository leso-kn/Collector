import * as BiliSpaceService from "./services/bilispace/BiliSpaceService";
import * as DefaultService from "./services/default/DefaultService";

const availableServices = [
    DefaultService.getDefaultService,
    BiliSpaceService.getBiliSpaceService
]

export const findService = async (url, id, data)=>{
    let availableService = null
    for(let service of availableServices){
        availableService = availableService || await service(url, id, data)
    }
    return availableService
}


