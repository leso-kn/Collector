import React, {useEffect, useState} from 'react';
import {Posts} from "./Posts";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Feeds = ({navigation, randomID}) => {
    const [urls, setUrls] = useState(null)
    const [ids, setIds] = useState(null)
    useEffect(() => {
        AsyncStorage.getItem("subscriptionData").then(res => {
            let feeds = JSON.parse(res)?.feeds
            setIds(feeds?.map(x => x.isRSS?"RSSSource":null))
            setUrls(feeds?.map(x => x.url))
        })
    }, [randomID])
    return urls ? <Posts urls={urls} ids={ids} navigation={navigation} randomID={randomID} sort={1}/> : null

}