import React, {useEffect, useReducer, useState} from 'react';
import {Posts} from "./Posts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ifWrapper from "../utils";

export const Feeds = ({navigation, randomID}) => {
    const [urls, setUrls] = useState(null)
    useEffect(() => {
        AsyncStorage.getItem("subscriptionData").then(res => {
            setUrls(JSON.parse(res).feeds.map(x => x.url))
        })
    }, [randomID])
    return ifWrapper(urls, <Posts urls={urls} navigation={navigation} randomID={randomID} sort={1}/>)

}