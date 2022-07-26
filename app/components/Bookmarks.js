import React, {useEffect, useReducer, useState} from 'react';
import {FlatList, Text, TextInput, TouchableNativeFeedback, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import {ConfirmDialog} from "react-native-simple-dialogs";

export const Bookmarks = ({navigation, randomID}) => {
    const [bookmarks, setBookmarks] = useState()
    const [dialogVisible, setDialogVisible] = useState(false)
    const [text, changeText] = useState("")
    useEffect(() => {
        AsyncStorage.getItem("bookmarks").then(res => {
            if (!res) {
                AsyncStorage.setItem("bookmarks", JSON.stringify([]))
            }
            setBookmarks(JSON.parse(res) || [])
        })
    }, [randomID])
    return (
        <View>
            <FlatList data={bookmarks && Object.entries(bookmarks)} renderItem={data => {
                return (
                    <TouchableNativeFeedback onPress={()=>navigation.push("Group", {title: data.item[0], key: "bookmarks"})}>
                        <View style={{
                            marginLeft: 10,
                            marginRight: 10,
                            height: 100,
                            backgroundColor: "white"
                        }}>
                            <Text style={{marginTop: 20, marginLeft: 25, fontSize: 18, color: "black"}}>
                                {data.item[0]}
                            </Text>
                            <Text style={{marginTop: 10, marginLeft: 25, color:"gray"}}>
                                {data.item[1].length + " items"}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                )
            }}
                      ItemSeparatorComponent={()=>(<View style={{height: 10}}/>)}
                      style={{marginTop: 5}}
                      ListFooterComponent={
                          <TouchableNativeFeedback onPress={() => setDialogVisible(true)}>
                              <View style={{
                                  marginLeft: 10,
                                  marginRight: 10,
                                  marginTop: 10,
                                  height: 100,
                                  backgroundColor: "white",
                                  alignItems: "center",
                                  justifyContent: "center"
                              }}>
                                  <Ionicons name={"add"} size={40} color={"gray"}/>
                              </View>
                          </TouchableNativeFeedback>}
            />
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
                               style={{borderWidth: 0.3, borderColor: "black", paddingLeft: 10}}/>
                </View>
            </ConfirmDialog>
        </View>
    )
}