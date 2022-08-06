import * as BiliSpaceService from "./services/bilispace/BiliSpaceService";
import * as DefaultService from "./services/default/DefaultService";
import * as BiliArticleService from "./services/BiliArticle/BiliArticleService"
import * as TwitterService from "./services/Twitter/TwitterService"

const availableServices = [
    DefaultService.getDefaultService,
    BiliSpaceService.getBiliSpaceService,
    BiliArticleService.getBiliArticleService,
    TwitterService.getTwitterService
]

export const findService = async (url, id, data)=>{
    let availableService = null
    for(let service of availableServices){
        availableService = availableService || await service(url, id, data)
    }
    return availableService
}


