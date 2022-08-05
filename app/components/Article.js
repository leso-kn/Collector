import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, View} from "react-native";
import {deviceWidth} from "../constants";
import RenderHTML from "react-native-render-html";
import axios from "axios";

export const Article = ({route, navigation})=>{
    const [html, setHtml] = useState(route.params.html)
    useEffect(()=>{
        if(!route.params.html && route.params.url){
            axios.get(route.params.url).then(res=>
                setHtml(res.data.split("//").join("https://")
                    .split("data-").join("")
                    .split("http:https").join("https")
                    .split("https:https").join("https")))
        }
    },[])
    return (
        <FlatList 
            data={[]}
            ListEmptyComponent={()=>(<View style={{width:deviceWidth*0.95}}>
                <RenderHTML source={{"html": html}} contentWidth={deviceWidth*0.95}
                            enableExperimentalGhostLinesPrevention={true}
                            enableExperimentalMarginCollapsing={true}
                            enableExperimentalBRCollapsing={true} ignoredDomTags={["canvas"]}/>
            </View>)}
            contentContainerStyle={{justifyContent:"center", alignItems:"center"}} renderItem={()=>null}/>
    )
}