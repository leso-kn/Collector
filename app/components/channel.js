import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
    Button,
    Dimensions,
    FlatList,
    Image,
    LogBox,
    SafeAreaView,
    ScrollView,
    Text, TouchableNativeFeedback,
    useWindowDimensions,
    View
} from "react-native";
import {findService, getTheme} from "../findService";
import ifWrapper, {exists, reducer} from "../utils";
import {deviceWidth, HOT_FIRST, OTHER_POST, PREVIEW_POST} from "../constants";
import AwesomeButton from "react-native-really-awesome-button";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import Post from "./post";
import {postPageUrl} from "../services/bilispace/BiliSpaceLinks";
import {Posts} from "./Posts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChannelInside = (props) => {
    const [data, dispatch] = useReducer(reducer, {})
    const layout = useWindowDimensions();
    const refContainer = useRef({})

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'posts', title: "Posts"},
        {key: 'friends', title: "Friends"}
    ]);

    const Friends = () => {
        return (
            <View></View>
        )

    }
    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'white'}}
            style={{height: 40}}
            labelStyle={{fontSize: 13, marginTop: -8, marginBottom: 0}}
        />
    );
    const renderScene = ({route}) => {
        switch (route.key) {
            case 'posts':
                return <Posts url={props.url} navigation={props.navigation}/>
            case 'second':
                return <Friends/>;
            default:
                return null;
        }
    };


    useEffect(() => {
        AsyncStorage.getItem("subscriptionData").then(res => refContainer.current.subscriptionData = JSON.parse(res))
            .then(() => findService(props.url)).then(res => {
            dispatch({
                field: [
                    "name", "headImgUrl", "avatar", "likeNum", "fanNum", "identifyName",
                    "followNum", "info", "additionalText", "headImgRatio", "url", "followed"
                ],
                val: [
                    res.getName(),
                    res.getHeadImgUrl(),
                    res.getAvatar(),
                    res.getLikeNum(),
                    res.getFanNum(),
                    res.getIdentifyName(),
                    res.getFollowNum(),
                    res.getInfo(),
                    res.getAdditionalText(),
                    res.getHeadImgRatio(),
                    "defaultChannelInfo",
                    exists(refContainer.current.subscriptionData.feeds, data)
                ]
            })
        })
    }, [])


    return (
        <View style={{flex: 1}}>
            <Image source={{uri: data.headImgUrl}}
                   style={{width: "100%", height: deviceWidth * data.headImgRatio || 0}}
                   resizeMode={"center"}/>
            <View style={{backgroundColor: "white"}}>
                <View style={{flexDirection: "row", marginLeft: 10}}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <Image source={{uri: data.avatar}} style={{
                            width: 80, height: 80, borderRadius: 40, marginTop: -30
                        }}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={{
                                marginTop: 5,
                                fontWeight: "500",
                                color: "black",
                                fontSize: 15
                            }}>{data.name}</Text>
                            <Text style={{marginTop: 2, fontSize: 12, color: "gray"}}>{"@" + data.identifyName}</Text>
                        </View>
                    </View>
                    <TouchableNativeFeedback style={{marginRight: 0}}
                                             onPress={() => {
                                                 if(data.followed === -1){
                                                     refContainer.current.subscriptionData.feeds.push(data)
                                                 }
                                                 else{
                                                     refContainer.current.subscriptionData.feeds.splice(data.followed, 1)
                                                 }
                                                 AsyncStorage.setItem("subscriptionData", JSON.stringify(refContainer.current.subscriptionData))
                                             }}>
                        <View style={{
                            marginRight: 10,
                            backgroundColor: data.followed === -1?"#e84f4f":"#ececec",
                            height: 35,
                            justifyContent: "center",
                            alignContent: "center",
                            borderRadius: 5,
                            marginTop: 5
                        }}>
                            <Text style={{
                                color: data.followed === -1?"#f1ecec":"black",
                                fontWeight: "400",
                                marginTop: -2,
                                marginRight: 25,
                                marginLeft: 25
                            }}>{data.followed === -1?"Subscribe":"Subcribed"}</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{
                    marginTop: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 5,
                    marginRight: 5
                }}>
                    <Text style={{color: "gray", fontSize: 13}}>{data.info || "No description provided"}</Text>
                    {ifWrapper(data.additionalData, (
                        <Text style={{fontSize: 11, color: "#504d4d", marginTop: 5}}>{data.additionalText}</Text>))}
                </View>
                <View style={{flexDirection: "row", marginBottom: 10, marginTop: 10}}>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0.5,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{color: "#504d4d", fontSize: 13}}>{"Followers"}</Text>
                        <Text style={{color: "#504d4d", fontSize: 13}}>{data.fanNum}</Text>
                    </View>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0.5,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{color: "#504d4d", fontSize: 13}}>{"Friends"}</Text>
                        <Text style={{color: "#504d4d", fontSize: 13}}>{data.followNum}</Text>
                    </View>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{color: "#504d4d", fontSize: 13}}>{"Likes"}</Text>
                        <Text style={{color: "#504d4d", fontSize: 13}}>{data.likeNum}</Text>
                    </View>
                </View>
            </View>

            <TabView
                renderTabBar={renderTabBar}
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: layout.width}}
            />
        </View>

    )
}
const Channel = (packedProps) => {
    let props = packedProps.route.params
    return (
        <FlatList data={[props]}
                  renderItem={(prop) =>
                      (<ChannelInside url={props.url} navigation={packedProps.navigation}/>)}/>
    )
}
export default Channel