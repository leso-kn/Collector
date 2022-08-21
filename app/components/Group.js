import React, {useEffect, useState} from 'react';
import {Channels} from "./Channels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TouchableNativeFeedback, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {LocalPosts} from "./LocalPosts";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const Group = ({navigation, route})=>{
    const [data, setData] = useState()
    const [randomID, doUpdate] = useState(Math.random()*1000)
    useEffect(() => {
        if(route.params.type === "blocklist"){
            AsyncStorage.getItem("blocklist").then(res => {
                setData(JSON.parse(res)?.channels)
            })
        }
        else{
            AsyncStorage.getItem(route.params.key).then(res => {
                setData(JSON.parse(res))
            })
        }
    },[randomID])
    useEffect(()=>{
        navigation.setOptions({
            "title": route.params.title,
            headerRight: HeaderRightElement
        })
    },[])

    const HeaderRightElement = () => {
        return (<View style={{flexDirection: "row"}}>
            <RefreshButton/>
            {["blocklist", "RSS"].includes(route.params.type)?null:<DeleteButton/>}
        </View>)
    }
    const DeleteButton = () => {
        return (
            <View style={{marginTop:-2, marginRight: -2, marginLeft: 25}}>
                <TouchableNativeFeedback onPress={() => {
                    AsyncStorage.getItem(route.params.key).then(res=>{
                        let newData = {...JSON.parse(res)}
                        delete newData[route.params.title]
                        AsyncStorage.setItem(route.params.key, JSON.stringify(newData))
                        navigation.pop()
                    })
                }}>
                    <MaterialCommunityIcons name={"delete"} size={24}/>
                </TouchableNativeFeedback>
            </View>
        )
    }
    const RefreshButton = () => {
        return (
            <View style={{}}>
                <TouchableOpacity onPress={() => doUpdate(Math.random()*1000)}>
                    <FontAwesome name={"refresh"} size={20}/>
                </TouchableOpacity>
            </View>
        )
    }
    switch (route.params.type){
        case "posts":
            return (
                <LocalPosts data={data?.[route.params.title]}
                          randomID={Math.random()*1000}
                          navigation={navigation}/>
            )
        case "channels":
            return (
                <Channels data={data?.[route.params.title]}
                          randomID={Math.random()*1000}
                          navigation={navigation}/>
            )
        case "blocklist":
        case "RSS":
            return (
                <Channels data={data}
                          randomID={Math.random()*1000}
                          navigation={navigation}/>
            )
    }

}