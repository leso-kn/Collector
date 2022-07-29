import React, {useEffect, useState} from 'react';
import {Channels} from "./Channels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TouchableNativeFeedback, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {LocalPosts} from "./LocalPosts";

export const Group = ({navigation, route})=>{
    const [data, setData] = useState()
    useEffect(() => {
        AsyncStorage.getItem(route.params.key).then(res => {
            setData(JSON.parse(res))
        })
    },[])
    useEffect(()=>{
        navigation.setOptions({
            "title": route.params.title,
            headerRight: HeaderRightElement
        })
    },[])

    const HeaderRightElement = () => {
        return (<View style={{flexDirection: "row"}}>
            <DeleteButton/>
        </View>)
    }
    const DeleteButton = () => {
        return (
            <View>
                <TouchableNativeFeedback onPress={() => {
                    AsyncStorage.getItem(route.params.key).then(res=>{
                        let newData = {...JSON.parse(res)}
                        delete newData[route.params.title]
                        AsyncStorage.setItem(route.params.key, JSON.stringify(newData))
                        navigation.pop()
                    })
                }}>
                    <MaterialCommunityIcons name={"delete"} size={25}/>
                </TouchableNativeFeedback>
            </View>
        )
    }
    switch (route.params.key){
        case "bookmarks":
            return (
                <LocalPosts data={data?.[route.params.title]}
                          randomID={Math.random()}
                          navigation={navigation}/>
            )
        case "subscriptionData":
            return (
                <Channels data={data?.[route.params.title]}
                          randomID={Math.random()}
                          navigation={navigation}/>
            )
    }

}