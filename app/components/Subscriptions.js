import React, {useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, Text, View} from "react-native";
import {getTheme} from "../findService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Channels} from "./Channels";
import ifWrapper from "../utils";
import SafeAreaViewPlus from "react-native-zy-safe-area-plus";

export const Subscriptions = ({navigation}) => {
    const testdata = [{title: "Test", amount: 10}]
    const [subscriptionData, setSubscriptionData] = useState({})
    useEffect(() => {
        AsyncStorage.getItem("subscriptionData").then(res => {
            setSubscriptionData(JSON.parse(res))
        })
    }, [])
    return (
        <SafeAreaViewPlus>
            <View style={{height: 50, backgroundColor: getTheme().color, marginTop: 0}}>
                <Text style={{marginLeft: 15, fontSize: 19, color: "black", fontWeight: "500", marginTop: 10}}>
                    Groups
                </Text>
            </View>
            <FlatList style={{flexGrow:0}} data={testdata} renderItem={data => (
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
                        {`${data.item.title}`}
                    </Text>
                    <Text style={{color: "gray", fontSize: 13, marginTop: 2}}>
                        {`(${data.item.amount})`}
                    </Text>
                </View>
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
                              <Ionicons name={"add-circle"} size={25}/>
                          </View>
                      )}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />
            <View style={{height: 50, backgroundColor: getTheme().color}}>
                <Text style={{marginLeft: 15, fontSize: 19, color: "black", fontWeight: "500", marginTop: 10}}>
                    Favourites
                </Text>
            </View>
            {ifWrapper(subscriptionData.feeds, <Channels data={subscriptionData.feeds}
                                                                       navigation={navigation}/>)}


        </SafeAreaViewPlus>
    )
}