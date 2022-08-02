import React, {useEffect, useReducer, useState} from 'react';

import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {Image, Text, View} from "react-native";
import {getCurrentServiceIcon, getCurrentServiceUrl, getTheme} from "../utils";
import {Picker} from '@react-native-picker/picker';
import {deviceWidth} from "../constants";
import AntDesign from "react-native-vector-icons/AntDesign";

export const Drawer = (props) => {
    const [selectedService, setSelectedService] = useState("biliSpace");
    let trendings = []
    for(let item of getCurrentServiceUrl().getTrendingUrls()){
        trendings.push(<DrawerItem
            label={item.label}
            onPress={() => props.navigation.navigate("Trending", {url:item.url})}
        />)
    }
    return (
        <DrawerContentScrollView {...props}>
            <View style={{backgroundColor: getTheme().color, flex: 1, marginTop: -44}}>
                <View style={{justifyContent: "center", alignItems: "center", marginTop: 40}}>
                    <Image source={require("../../assets/ic_launcher_round.png")} style={{height: 100, width: 100}}/>
                    <Text style={{fontWeight: "bold", fontSize: 25, marginTop: 10}}>
                        Collector
                    </Text>
                    <View style={{flexDirection: "row", marginTop:10}}>
                        <Text style={{fontSize: 16, marginTop: 10, marginBottom: 10}}>
                            {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
                        </Text>
                    </View>
                </View>
                <Image source={getCurrentServiceIcon()}
                       style={{top:207, height: 18, width: 18, position:"absolute",left:18}}/>
                <View style={{position: "absolute", left: "90%", top: 210}}>
                    <AntDesign name={"caretdown"} size={10}/>
                </View>
            </View>
            {trendings}
            <View style={{backgroundColor: "#dad7d7", height: 0.4}}/>
            <DrawerItem
                label="Help"
                onPress={() => alert(1)}
            />
        </DrawerContentScrollView>
    )
}