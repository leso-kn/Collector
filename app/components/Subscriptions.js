import React, {useEffect, useState} from 'react';
import {FlatList, Text, TextInput, TouchableNativeFeedback, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Channels} from "./Channels";
import {getTheme} from "../utils";
import SafeAreaViewPlus from "react-native-zy-safe-area-plus";
import {ConfirmDialog} from 'react-native-simple-dialogs';

const renderFunc = (navigation, blocklist)=> data => (
    <TouchableNativeFeedback onPress={() => navigation.push("Group", {
        'title': data.item[0],
        key: "subscriptionData",
        type:"channels"
    })}>
        <View style={{
            marginBottom: 10,
            marginTop: 10,
            height: 60,
            minWidth: 100,
            alignItems: "center",
            justifyContent: "center",
            borderWidth:0.2,
            borderColor: "gray"
        }}>
            <Text style={{
                fontSize: 15,
                marginTop: 0,
                fontWeight: "500",
                marginLeft: 20,
                marginRight: 20,
                color:getTheme().textColor,
            }}>
                {`${data.item[0]}`}
            </Text>
            <Text style={{color: "gray", fontSize: 13, marginTop: 2}}>
                {`(${data.item[1].filter(x => !blocklist.includes(x.isRSS?"RSS"+x.url :x.identifyID)).length})`}
            </Text>
        </View>
    </TouchableNativeFeedback>
)

export const Subscriptions = ({navigation, randomID}) => {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [text, changeText] = useState("")
    const [subscriptionData, setSubscriptionData] = useState({})
    const [RSSData, setRSSData] = useState([])
    const [blocklist, setBlocklist] = useState([])
    useEffect(() => {
        AsyncStorage.getItem("blocklist").then(res=> {
            res = JSON.parse(res)
            setBlocklist(res.channels.map(x => x.identifyID))
        })
        AsyncStorage.getItem("subscriptionData").then(res => {
            res&&setSubscriptionData(JSON.parse(res))
        })
        AsyncStorage.getItem("RSS").then(res=>{
            !res && AsyncStorage.setItem("RSS", JSON.stringify([]))
            res && setRSSData(JSON.parse(res))
        })
    }, [randomID])
    return (
        <SafeAreaViewPlus barStyle={getTheme().isDarkTheme?null:undefined}>
            <View style={{height: 50, backgroundColor: getTheme().color, marginTop: 0}}>
                <Text style={{marginLeft: 15, fontSize: 19, color:getTheme().textColor,  fontWeight: "500", marginTop: 10}}>
                    Groups
                </Text>
            </View>
            <FlatList style={{flexGrow:0 ,backgroundColor:getTheme().backgroundColor}}
                      data={subscriptionData && Object.entries(subscriptionData).filter(x => x[0] !== "feeds")}
                      renderItem={renderFunc(navigation, blocklist)}
                      horizontal={true}
                      ListHeaderComponent={(
                          <TouchableNativeFeedback onPress={() => navigation.push("Group", {
                              key: "RSS",
                              type:"RSS",
                              title:"RSS"
                          })}>
                              <View style={{
                                  margin:10,
                                  height: 60,
                                  minWidth: 100,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderWidth:0.2,
                                  borderColor: "gray"
                              }}>
                                  <Text style={{
                                      fontSize: 15,
                                      marginTop: 0,
                                      fontWeight: "500",
                                      marginLeft: 20,
                                      marginRight: 20,
                                      color:getTheme().textColor,
                                  }}>
                                      {'RSS'}
                                  </Text>
                                  <Text style={{color: "gray", fontSize: 13, marginTop: 2}}>
                                      {`(${RSSData.filter(x => !blocklist.includes(x.isRSS?"RSS"+x.url :x.identifyID)).length})`}
                                  </Text>
                              </View>
                          </TouchableNativeFeedback>
                      )}
                      ListFooterComponent={(
                          <View style={{
                              marginBottom: 10,
                              marginLeft: 10,
                              marginTop: 10,
                              height: 60,
                              width: 80,
                              alignItems: "center",
                              justifyContent: "center",
                              borderWidth:0.2,
                              borderColor: "gray"
                          }}>
                              <TouchableNativeFeedback onPress={() => setDialogVisible(true)}>
                                  <Ionicons name={"add-circle"} size={25}/>
                              </TouchableNativeFeedback>
                          </View>
                      )}
                      ItemSeparatorComponent={() => (<View style={{width: 10}}/>)}
            />
            <View style={{height: 50, backgroundColor: getTheme().color}}>
                <Text style={{marginLeft: 15, fontSize: 19,color:getTheme().textColor, fontWeight: "500", marginTop: 11}}>
                    Favourites
                </Text>
            </View>
            {subscriptionData?.feeds ? <Channels data={subscriptionData?.feeds} randomID={Math.random()*1000}
                                                 navigation={navigation}/> : null}
            <ConfirmDialog
                title="Add folder"
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
                        if (subscriptionData[text] !== undefined) {
                            alert("Name already exists")
                        } else {
                            subscriptionData[text] = []
                            setSubscriptionData(subscriptionData)
                            AsyncStorage.setItem("subscriptionData", JSON.stringify(subscriptionData))
                            setDialogVisible(false)
                        }
                        changeText("")
                    }
                }}>
                <View>
                    <TextInput value={text}
                               placeholder={"Folder Name"}
                               onChangeText={(value) => changeText(value)}
                               style={{borderWidth: 0.3, borderColor: getTheme().borderColor, paddingLeft: 10}}/>
                </View>
            </ConfirmDialog>

        </SafeAreaViewPlus>
    )
}