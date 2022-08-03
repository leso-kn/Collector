import React, {useEffect} from 'react';
import {TextInput, TouchableOpacity, Clipboard} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {showMessage} from "react-native-flash-message";

export const FreeCopy = ({route, navigation})=>{
    useEffect(()=>{
        navigation.setOptions({
            headerRight:()=>(
                <TouchableOpacity onPress={()=>{
                    Clipboard.setString(route.params.content)
                    showMessage({
                        message: "Copied",
                        type: "success",
                        icon: "success",
                        duration:500,
                        style: {justifyContent: "center", alignItems: "center", height:70, paddingTop:30},
                        statusBarHeight: 0,
                    })
                }}>
                    <MaterialCommunityIcons name={"content-copy"} size={23}/>
                </TouchableOpacity>
            )
        })
    },[])
    return <TextInput value={route.params.content}/>
}