import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import WebView from "react-native-webview";

export const Article = ({route, navigation})=>{
    useEffect(()=>{
        navigation.setOptions({
            headerRight: ()=>(
                <TouchableOpacity onPress={()=>navigation.push("FullPost", {url: route.params.url})}>
                    <View>
                        <Text>
                            Comments
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        })
    },[])
    return (
        <WebView source={{uri: route.params.url}}/>
    )
}