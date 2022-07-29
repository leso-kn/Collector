import React, {useEffect, useReducer, useState} from 'react';
import {Image, Text, TouchableNativeFeedback, View} from "react-native";
import {findService} from "../findService";
import {reducer} from "../utils";

export const ChannelInfo = React.memo((props) => {
    const [data, dispatch] = useReducer(reducer, {})
    useEffect(() => {
        findService(props.data.url, null, props.data).then((res) => {
            dispatch({
                field: [
                    "name", "avatar", "info", "identifyName","url"
                ],
                val: [
                    res.getName(), res.getAvatar(), res.getInfo(), res.getIdentifyName(), res.getUrl()
                ]
            })
        })
    }, [])
    return (
        <TouchableNativeFeedback
            onPress={() => props.navigation.push("Channel", {url: data.url})}>
            <View style={{flexDirection: "row", marginTop: 7.5, marginBottom: 7.5}}>
                <Image source={{uri: data.avatar}}
                       style={{
                           width: 50,
                           height: 50,
                           borderRadius: 25,
                           marginRight: 15,
                           marginLeft:15,
                           marginTop: 3
                       }}/>
                <View style={{width: 284}}>
                    <Text style={{color: "black", fontSize: 13, marginTop: 3, fontWeight:"500"}}>{data.name}</Text>
                    <Text style={{color: "gray", fontSize: 11}}>{"@" + data.identifyName}</Text>
                    <Text style={{color: "black", marginTop: 5, fontSize: 12}} numberOfLines={1}>{data.info}  </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
})