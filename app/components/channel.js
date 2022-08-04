import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
    Button,
    FlatList,
    Image,
    Text, TextInput, TouchableNativeFeedback,
    View
} from "react-native";
import {findService} from "../findService";
import {exists, getTheme, reducer} from "../utils";
import {deviceWidth} from "../constants";
import {TabBar, TabView} from "react-native-tab-view";
import {Posts} from "./Posts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ConfirmDialog} from "react-native-simple-dialogs";
import SelectMultiple from "react-native-select-multiple";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImageView from "react-native-image-viewing";
import checkbox from "../../assets/icon-checkbox-modified.png";
import checkboxChecked from "../../assets/icon-checkbox-checked-modified.png";

const ChannelInside = (props) => {
    const [data, dispatch] = useReducer(reducer, {})
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogVisible1, setDialogVisible1] = useState(false)
    const [showAvatar, setShowAvatar] = useState(false)
    const [text, changeText] = useState("")
    const [index, setIndex] = React.useState(0);
    const [selected, setSelected] = useState()
    const [routes] = React.useState([
        {key: 'posts', title: "Posts"},
        // {key: 'friends', title: "Friends"}
    ]);
    const [subscriptionData, setSubscriptionData] = useState(null)
    const followed = exists(subscriptionData?.feeds, data)
    const [block, setBlock] = useState(false)

    const Friends = () => {
        return (
            <View></View>
        )

    }
    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'white'}}
            style={{height: 40, backgroundColor: getTheme().tabBarColor}}
            labelStyle={{fontSize: 13, marginTop: -8, marginBottom: 0}}
        />
    );
    const renderScene = ({route}) => {
        switch (route.key) {
            case 'posts':
                return <Posts urls={[props.url]} navigation={props.navigation}/>
            // case 'second':
            //     return <Friends/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        let identifyID
        findService(props.url).then(res => {
            identifyID = res.getIdentifyID()
            dispatch({
                field: [
                    "name", "headImgUrl", "avatar", "likeNum", "fanNum", "identifyName",
                    "followNum", "info", "additionalText", "headImgRatio", "url", "identifyID"
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
                    res.getUrl(),
                    res.getIdentifyID()
                ]
            })
        }).then(res => AsyncStorage.getItem("blocklist")).then(res => {
            if (!res) {
                AsyncStorage.setItem("blocklist", JSON.stringify({words: [], channels: []}))
            }
            let tempList = JSON.parse(res) || {words: [], channels: []}
            setBlock(tempList.channels.map(x => x.identifyID).includes(identifyID))
        })
    }, [])
    useEffect(() => {
        AsyncStorage.getItem("subscriptionData").then(res => {
            setSelected(res && Object.entries(JSON.parse(res)).filter(x => {
                let flag = false
                for (let i of x[1]) {
                    flag = flag || (i.identifyID === data.identifyID)
                }
                return flag && x[0] !== 'feeds'
            }).map(x => {
                return {label: x[0], value: x[0]}
            }))
            setSubscriptionData(JSON.parse(res))
        })
    }, [data])
    return block?(
        <View style={{justifyContent:"center", alignItems:"center"}}>
            <Text style={{fontSize:20, fontWeight:"600", marginVertical:40}}>
                This user has been blocked
            </Text>
            <Button title={"Remove from blocklist"} color={getTheme().buttonBackgroundColor} onPress={()=> {
                AsyncStorage.getItem("blocklist").then(res => {
                    let temp = JSON.parse(res)
                    temp.channels = temp.channels.filter(x => x.identifyID !== data.identifyID)
                    AsyncStorage.setItem("blocklist", JSON.stringify(temp))
                })
                props.navigation.pop()
            }}/>
        </View>
    ) :(
        <View style={{flex: 1}}>
            <Image source={{uri: data.headImgUrl}}
                   style={{width: "100%", height: deviceWidth * data.headImgRatio || 0}}
                   resizeMode={"center"}/>
            <View style={{backgroundColor: getTheme().postBackGroundColor}}>
                <View style={{flexDirection: "row", marginLeft: 10}}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <TouchableNativeFeedback onPress={() => setShowAvatar(true)}>
                            <Image source={{uri: data.avatar}} style={{
                                width: 80, height: 80, borderRadius: 40, marginTop: -30
                            }}/>
                        </TouchableNativeFeedback>
                        <View style={{marginLeft: 10}}>
                            <Text style={{
                                marginTop: 5,
                                fontWeight: "500",
                                color: getTheme().textColor,
                                fontSize: 15
                            }}>{data.name}</Text>
                            <Text style={{marginTop: 2, fontSize: 12, color: "gray"}}>{"@" + data.identifyName}</Text>
                        </View>
                    </View>
                    <TouchableNativeFeedback onPress={() => setDialogVisible1(true)}>
                        <View style={{marginRight: 10, marginTop: 8}}>
                            <MaterialIcons name={"playlist-add"} size={25}/>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                        style={{marginRight: 0}}
                        onPress={() => {
                            let newData = {...subscriptionData}
                            if (!newData.feeds) {
                                newData.feeds = []
                            }
                            if (followed === -1) {
                                newData.feeds.push(data)
                            } else {
                                newData.feeds = newData.feeds.filter(
                                    item => item.name !== data.name && item.identifyName !== data.identifyname
                                )
                            }
                            AsyncStorage.setItem("subscriptionData", JSON.stringify(newData))
                            setSubscriptionData(newData)
                        }}>
                        <View style={{
                            marginRight: 10,
                            backgroundColor: followed === -1 ? "#e84f4f" : "#ececec",
                            height: 35,
                            justifyContent: "center",
                            alignContent: "center",
                            borderRadius: 5,
                            marginTop: 5
                        }}>
                            <Text style={{
                                color: followed === -1 ? "#f1ecec" : "black",
                                fontWeight: "400",
                                marginTop: -2,
                                marginRight: 25,
                                marginLeft: 25
                            }}>{followed === -1 ? "Subscribe" : "Subcribed"}</Text>
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
                    {data.additionalData ? (
                        <Text
                            style={{fontSize: 11, color: "#504d4d", marginTop: 5}}>{data.additionalText}</Text>) : null}
                </View>
                <View style={{flexDirection: "row", marginBottom: 10, marginTop: 10}}>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0.5,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{ fontSize: 13}}>{"Followers"}</Text>
                        <Text style={{fontSize: 13}}>{data.fanNum}</Text>
                    </View>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0.5,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{ fontSize: 13}}>{"Friends"}</Text>
                        <Text style={{ fontSize: 13}}>{data.followNum}</Text>
                    </View>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{ fontSize: 13}}>{"Likes"}</Text>
                        <Text style={{fontSize: 13}}>{data.likeNum}</Text>
                    </View>
                </View>
            </View>

            <TabView
                renderTabBar={renderTabBar}
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: deviceWidth}}
            />
            <ImageView
                images={[{uri: data.avatar}]}
                imageIndex={0}
                visible={showAvatar}
                onRequestClose={() => setShowAvatar(false)}
            />
            <ConfirmDialog
                dialogStyle={{backgroundColor: getTheme().postBackGroundColor}}
                titleStyle={{color: getTheme().textColor}}
                contentStyle={{color: getTheme().postBackGroundColor}}
                title={"Add to"}
                visible={dialogVisible1}
                onTouchOutside={() => {
                    setDialogVisible1(false)
                }}
                myButton={{
                    title: "New folder",
                    titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                    onPress: () => setDialogVisible(true)
                }}
                negativeButton={{
                    title: "Cancel",
                    titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                    onPress: () => {
                        setDialogVisible1(false)
                    }
                }}
                positiveButton={{
                    title: "OK",
                    titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                    onPress: () => {
                        let newData = {...subscriptionData}
                        for (let item of selected) {
                            if (newData[item.label].filter(x => x.identifyID === data.identifyID).length > 0) continue
                            newData[item.label].push(data)
                        }
                        for (let item of Object.entries(subscriptionData).filter(x => x[0] !== 'feeds' && !selected.filter(y => y.label === x[0]).length)) {
                            newData[item[0]] = newData[item[0]].filter(x => x.identifyID !== data.identifyID)
                        }
                        setSubscriptionData(newData)
                        AsyncStorage.setItem("subscriptionData", JSON.stringify(newData))
                        setDialogVisible1(false)
                    }
                }}>
                <SelectMultiple onSelectionsChange={x => setSelected(x)}
                                rowStyle={{backgroundColor: getTheme().postBackGroundColor}}
                                checkboxSource={getTheme().isDarkTheme?checkbox:undefined}
                                selectedCheckboxSource={getTheme().isDarkTheme?checkboxChecked:undefined}
                                items={subscriptionData ? Object.entries(subscriptionData).filter(x => x[0] !== 'feeds').map(x => x[0]) : []}
                                selectedItems={selected}/>
            </ConfirmDialog>

            <ConfirmDialog
                dialogStyle={{backgroundColor: getTheme().postBackGroundColor}}
                titleStyle={{color: getTheme().textColor}}
                contentStyle={{color: getTheme().postBackGroundColor}}
                title="Add folder"
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                negativeButton={{
                    title: "Cancel",
                    titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                    onPress: () => {
                        changeText("")
                        setDialogVisible(false)
                    }
                }}
                positiveButton={{
                    title: "OK",
                    titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                    onPress: () => {
                        changeText("")
                        if (subscriptionData[text] !== undefined) {
                            alert("Name already exists")
                        } else {
                            subscriptionData[text] = []
                            setSubscriptionData(subscriptionData)
                            AsyncStorage.setItem("subscriptionData", JSON.stringify(subscriptionData))
                            setDialogVisible(false)
                        }

                    }
                }}>
                <View>
                    <TextInput value={text}
                               placeholder={"Folder Name"}
                               onChangeText={(value) => changeText(value)}
                               style={{borderWidth: 0.3, borderColor: getTheme().borderColor, paddingLeft: 10}}/>
                </View>
            </ConfirmDialog>
        </View>

    )
}
const Channel = (packedProps) => {
    let props = packedProps.route.params
    return (
        <FlatList data={[props]}
                  renderItem={(prop) => {
                      return (<ChannelInside url={props.url} navigation={packedProps.navigation}/>)
                  }}/>
    )
}
export default Channel