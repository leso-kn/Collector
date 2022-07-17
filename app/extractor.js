import {getBiliSpaceService} from "./services/bilispace/bilispaceService";

const availableServices = [
    getBiliSpaceService
]

const findService = async (url)=>{
    let availableService = null
    for(let service of availableServices){
        availableService = availableService || await service(url)
    }
    return availableService
}

const extract = async (url)=>{
    let service = await findService(url)
}