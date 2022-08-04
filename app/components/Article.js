import React from 'react';
import {ScrollView, View} from "react-native";
import {deviceWidth} from "../constants";
import RenderHTML from "react-native-render-html";

export const Article = ({route, navigation})=>{
    return (
        <ScrollView contentContainerStyle={{justifyContent:"center", alignItems:"center"}}>
            <View style={{width:deviceWidth*0.95}}>
                <RenderHTML source={{html:route.params.html}} contentWidth={deviceWidth*0.95}/>
            </View>
        </ScrollView>
    )
}