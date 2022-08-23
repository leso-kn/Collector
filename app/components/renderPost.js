import {deviceWidth} from "../constants";
import React from "react";

export const onLayout = (post, layoutMap, isLocalPost)=>{
    return e => {
        if (e.nativeEvent.layout.width !== deviceWidth) return
        let tempID = !isLocalPost?post.item.getIdentifyID(): post.item.identifyID
        let item = layoutMap.current.get(tempID)
        if (!item || (item && item.height < e.nativeEvent.layout.height)) {
            let offsetValue = 0
            for (let i of layoutMap.current) {
                if (i[0] === tempID) break
                offsetValue += i[1].height
            }
            layoutMap.current.set(tempID, {height: e.nativeEvent.layout.height, offset: offsetValue})
        }
    }
}
export const getItemLayout = (layoutMap, isLocalPost)=>{
    return (data, index) => {
        let item = layoutMap.current.get(!isLocalPost? data[index].getIdentifyID(): data[index].identifyID)
        if (!item) return undefined
        return {length: item.height, offset: item.offset, index}
    }
}