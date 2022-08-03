import React, {useEffect} from 'react';
import {TextInput, TouchableOpacity, Clipboard, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {showMessage} from "react-native-flash-message";
import {getTheme} from "../utils";

export const FreeCopy = ({route, navigation}) => {
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    Clipboard.setString(route.params.content)
                    showMessage({
                        message: "Copied",
                        type: "success",
                        icon: "success",
                        duration: 500,
                        style: {justifyContent: "center", alignItems: "center", height: 70, paddingTop: 30},
                        statusBarHeight: 0,
                    })
                }}>
                    <MaterialCommunityIcons name={"content-copy"} size={23}/>
                </TouchableOpacity>
            )
        })
    }, [])
    return (
        <View style={{flex:1, backgroundColor: getTheme().postBackGroundColor}}>
            <TextInput value={route.params.content}/>
        </View>
    )
}