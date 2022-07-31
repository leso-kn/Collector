import * as BiliSpaceService from "./services/bilispace/BiliSpaceService";
import {themeDefault} from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function shortenLargeNumber(num, digits) {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        decimal;

    for (var i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);

        if (num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return num;
}

// const forWrapper = (ti)

export const reducer = (data, action) => {
    let newData = {...data}
    for (let i = 0; i < action.field.length; i++) {
        newData[action.field[i]] = action.val[i]
    }
    return newData
}

export const exists = (data, cmpData) =>{
    if(!data || !cmpData)return -1;
    for(const [index, item] of data.entries()){
        if(item.name === cmpData.name && item.identifyName === cmpData.identifyName) return index
    }
    return -1;
}

export const isBlocked = (data, blockList)=>{
    for(let channel of blockList.channels){
        if(data.channelIdentifyID === channel.identifyID)return true
    }
    for(let word of blockList.words){
        if(data.content.includes(word))return true
    }
    return false
}

export const getCurrentService = async()=>{
    return await AsyncStorage.getItem("currentService")
}

export const updateCurrentService = async(name) =>{
    return AsyncStorage.setItem("currentService", name)
}

export const AvailableServiceNames = [
    "BiliSpace"
]

export const modifyUserServices = async(names) =>{
    let temp = []
    for(let item of names){
        temp.push(item)
    }
    AsyncStorage.setItem("userServices", JSON.stringify(temp))
    getCurrentService().then(res=>!res && updateCurrentService(temp[0]))
}

export const getCurrentServiceUrl = ()=>{
    return BiliSpaceService.serviceUrl
}
export const getTheme = ()=>{
    return themeDefault
}