import React, {useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, Text, TextInput, TouchableNativeFeedback, View} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Channels} from "./Channels";
import ifWrapper, {getTheme} from "../utils";
import SafeAreaViewPlus from "react-native-zy-safe-area-plus";
import {ConfirmDialog} from 'react-native-simple-dialogs';


export const Subscriptions = ({navigation, randomID}) => {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [text, changeText] = useState("")
    const [subscriptionData, setSubscriptionData] = useState({})
    useEffect(() => {
        AsyncStorage.getItem("subscriptionData").then(res => {
            setSubscriptionData(JSON.parse(res))
        })
    }, [randomID])
    return (
        <SafeAreaViewPlus>
            <View style={{height: 50, backgroundColor: getTheme().color, marginTop: 0}}>
                <Text style={{marginLeft: 15, fontSize: 19, color: "black", fontWeight: "500", marginTop: 10}}>
                    Groups
                </Text>
            </View>
            <FlatList style={{flexGrow: 0}} data={subscriptionData && Object.entries(subscriptionData).filter(x => x[0] !== "feeds")}
                      renderItem={data => (
                          <TouchableNativeFeedback onPress={() => navigation.push("Group", {
                              'title': data.item[0],
                              key: "subscriptionData"
                          })}>
                              <View style={{
                                  marginBottom: 10,
                                  marginTop: 10,
                                  height: 60,
                                  minWidth: 100,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "white"
                              }}>
                                  <Text style={{
                                      color: "black",
                                      fontSize: 15,
                                      marginTop: 0,
                                      fontWeight: "500",
                                      marginLeft: 20,
                                      marginRight: 20
                                  }}>
                                      {`${data.item[0]}`}
                                  </Text>
                                  <Text style={{color: "gray", fontSize: 13, marginTop: 2}}>
                                      {`(${data.item[1].length})`}
                                  </Text>
                              </View>
                          </TouchableNativeFeedback>
                      )}
                      horizontal={true}
                      ListHeaderComponent={<View style={{width: 10, backgroundColor: "red"}}/>}
                      ListFooterComponent={(
                          <View style={{
                              marginBottom: 10,
                              marginLeft: 10,
                              marginTop: 10,
                              height: 60,
                              width: 80,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white"
                          }}>
                              <TouchableNativeFeedback onPress={() => setDialogVisible(true)}>
                                  <Ionicons name={"add-circle"} size={25}/>
                              </TouchableNativeFeedback>
                          </View>
                      )}
                      ItemSeparatorComponent={() => (<View style={{width: 10}}/>)}
            />
            <View style={{height: 50, backgroundColor: getTheme().color}}>
                <Text style={{marginLeft: 15, fontSize: 19, color: "black", fontWeight: "500", marginTop: 10}}>
                    Favourites
                </Text>
            </View>
            {ifWrapper(subscriptionData?.feeds, <Channels data={subscriptionData?.feeds} randomID={randomID}
                                                         navigation={navigation}/>)}
            <ConfirmDialog
                title="Add folder"
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                negativeButton={{
                    title: "NO",
                    onPress: () => {
                        changeText("")
                        setDialogVisible(false)
                    }
                }}
                positiveButton={{
                    title: "OK",
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
                               style={{borderWidth: 0.3, borderColor: "black", paddingLeft: 10}}/>
                </View>
            </ConfirmDialog>

        </SafeAreaViewPlus>
    )
}