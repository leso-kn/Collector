import React, {useEffect, useRef, useState} from 'react';

import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {Image, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {
    getCurrentService,
    getCurrentServiceIcon,
    getCurrentServiceUrls,
    getTheme,
    getUserServices,
    updateCurrentService
} from "../utils";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ConfirmDialog} from "react-native-simple-dialogs";
import * as rssParser from 'react-native-rss-parser';
import axios from "axios";

export const Drawer = (props) => {
    const [selectedService, setSelectedService] = useState("Twitter");
    const [isSelecting, setIsSelecting] = useState(false)
    const userServicesData = useRef([])
    const [trendingUrls, setTrendingUrls] = useState([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const [text, changeText] = useState("")
    useEffect(() => {
        getCurrentService().then(res => setSelectedService(res))
        getUserServices().then(res => userServicesData.current = res)
        getCurrentServiceUrls().then(res => res.getTrendingUrls()).then(res => setTrendingUrls(res))
    }, [selectedService])
    let trendings = [], userServices = []
    for (let item of trendingUrls) {
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
                            <Text style={{
                                fontSize: 16,
                                marginTop: 10,
                                marginBottom: 10,
                                width: "100%",
                                textAlign: "center"
                            }}>
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
                <View style={{backgroundColor: "#dad7d7", height: 0.3}}/>
                <DrawerItem label={"Blocked Users"}
                            key={"BlockedUsers"}
                            onPress={() => props.navigation.push("Group", {
                                title: "Blocked Users",
                                type: "blocklist"
                            })}/>
                <DrawerItem label={"Add RSS feed"} onPress={() => setDialogVisible(true)}/>
            </View>}
            <ConfirmDialog
                title="Add feed"
                dialogStyle={{backgroundColor: getTheme().postBackGroundColor}}
                titleStyle={{color: getTheme().textColor}}
                contentStyle={{color: getTheme().postBackGroundColor}}
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                negativeButton={{
                    titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                    title: "NO",
                    onPress: () => {
                        changeText("")
                        setDialogVisible(false)
                    }
                }}
                positiveButton={{
                    title: "OK",
                    titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                    onPress: () => {
                        AsyncStorage.getItem("RSS").then(res => JSON.parse(res)).then(res => {
                            if (res.filter(x => x.identifyID === text).length) {
                                alert("Feed already exists")
                            } else {
                                axios.get(text).then(res1 => rssParser.parse(res1.data)).then(res1 => {
                                    const originURL = res1.links?.[0]?.url
                                    res.push({
                                        name: res1.title,
                                        avatar: res1.image.url,
                                        isRSS: true,
                                        identifyName: originURL,
                                        info: res1.description,
                                        url: text
                                    })
                                    AsyncStorage.setItem("RSS", JSON.stringify(res))
                                })
                            }
                        })
                        changeText("")
                    }
                }}>
                <View>
                    <TextInput value={text}
                               placeholder={"Feed URL"}
                               onChangeText={(value) => changeText(value)}
                               style={{borderWidth: 0.3, borderColor: getTheme().borderColor, paddingLeft: 10}}/>
                </View>
            </ConfirmDialog>
        </DrawerContentScrollView>
    )
}