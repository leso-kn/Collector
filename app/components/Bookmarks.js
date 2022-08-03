import React, {useEffect, useState} from 'react';
import {FlatList, Text, TextInput, TouchableNativeFeedback, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import {ConfirmDialog} from "react-native-simple-dialogs";
import {getTheme} from "../utils";

export const Bookmarks = ({navigation, randomID}) => {
    const [bookmarks, setBookmarks] = useState()
    const [dialogVisible, setDialogVisible] = useState(false)
    const [text, changeText] = useState("")
    useEffect(() => {
        AsyncStorage.getItem("bookmarks").then(res => {
            if (!res) {
                AsyncStorage.setItem("bookmarks", JSON.stringify({"Default folder": []}))
            }
            setBookmarks(JSON.parse(res) || [])
        })
    }, [randomID])
    return (
        <View >
            <FlatList data={bookmarks && Object.entries(bookmarks)} renderItem={data => {
                return (
                    <TouchableNativeFeedback onPress={()=>navigation.push("Group", {title: data.item[0], key: "bookmarks", type:"posts"})}>
                        <View style={{
                            marginLeft:0,
                            height: 100,
                        }}>
                            <Text style={{marginTop:20, marginLeft: 25, fontSize: 18, color: getTheme().textColor}}>
                                {data.item[0]}
                            </Text>
                            <Text style={{marginTop: 15, marginLeft: 25, color:"gray"}}>
                                {data.item[1].length + " items"}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                )
            }}
                      style={{marginTop:-1.5}}
                      ItemSeparatorComponent={()=>(<View style={{height: 0.01, borderTopWidth:0.2, borderColor:"gray"}}/>)}
                      ListFooterComponent={
                          <TouchableNativeFeedback onPress={() => setDialogVisible(true)}>
                              <View style={{
                                  height: 100,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderTopWidth:0.2,
                                  borderBottomWidth:0.2,
                                  borderColor:"gray"
                              }}>
                                  <Ionicons name={"add"} size={40} color={"gray"}/>
                              </View>
                          </TouchableNativeFeedback>}
            />
            <ConfirmDialog
                dialogStyle={{backgroundColor: getTheme().postBackGroundColor}}
                titleStyle={{color: getTheme().textColor}}
                contentStyle={{color: getTheme().postBackGroundColor}}
                title="Add folder"
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                negativeButton={{
                    title: "NO",
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
                        if (bookmarks[text] !== undefined) {
                            alert("Name already exists")
                        } else {
                            let newData = {...bookmarks}
                            newData[text] = []
                            setBookmarks(newData)
                            AsyncStorage.setItem("bookmarks", JSON.stringify(newData))
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
        </View>
    )
}