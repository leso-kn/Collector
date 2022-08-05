import React, {useEffect, useRef, useState} from 'react';

import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {Image, Text, TouchableWithoutFeedback, View} from "react-native";
import {
    getCurrentServiceIcon,
    getCurrentServiceUrls,
    getTheme,
    getUserServices,
    updateCurrentService
} from "../utils";
import AntDesign from "react-native-vector-icons/AntDesign";

export const Drawer = (props) => {
    const [selectedService, setSelectedService] = useState("biliSpace");
    const [isSelecting, setIsSelecting] = useState(false)
    const userServicesData = useRef([])
    const trendingUrls = useRef([])
    useEffect(() => {
        getUserServices().then(res => userServicesData.current = res)
        getCurrentServiceUrls().then(res => res.getTrendingUrls()).then(res => trendingUrls.current = res)
    }, [])
    let trendings = [], userServices = []
    for (let item of trendingUrls.current) {
        trendings.push(<DrawerItem
            label={item.label}
            key={item.label}
            onPress={() => props.navigation.navigate("Trending", {url: item.url})}
        />)
    }
    for (let item of userServicesData.current) {
        userServices.push(<DrawerItem
            label={item} key={item}
            onPress={() => {
                updateCurrentService(item).then(res => {
                    setSelectedService(item)
                    setIsSelecting(!isSelecting)
                })
            }}
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
                    <TouchableWithoutFeedback onPress={() => setIsSelecting(!isSelecting)}>
                        <View style={{flexDirection: "row", marginTop: 10}}>
                            <Text style={{fontSize: 16, marginTop: 10, marginBottom: 10, width:"100%", textAlign:"center"}}>
                                {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Image source={getCurrentServiceIcon()}
                       style={{top: 207, height: 18, width: 18, position: "absolute", left: 18}}/>
                <View style={{position: "absolute", left: "90%", top: 210}}>
                    <AntDesign name={"caretdown"} size={10}/>
                </View>
            </View>
            {isSelecting ? userServices : <View>
                {trendings}
                <View style={{backgroundColor: "#dad7d7", height: 0.2}}/>
                <DrawerItem label={"Blocked Users"}
                            key={"BlockedUsers"}
                            onPress={() => props.navigation.push("Group", {
                                title: "Blocked Users",
                                type: "blocklist"
                            })}/>
            </View>}

        </DrawerContentScrollView>
    )
}