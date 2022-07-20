import {getBiliSpaceService} from "./services/bilispace/BiliSpaceService";

const availableServices = [
    getBiliSpaceService
]

export const findService = async (url, id, data)=>{
    let availableService = null
    for(let service of availableServices){
        availableService = availableService || await service(url, id, data)
    }
    return availableService
}
