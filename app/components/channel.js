import React, {useEffect, useReducer, useState} from 'react';
import {Button, Dimensions, Image, Text, View} from "react-native";
import {findService} from "../findService";
import {reducer} from "../utils";
import {deviceWidth} from "../constants";
import AwesomeButton from "react-native-really-awesome-button";

const Channel = (props) => {
    const [data, dispatch] = useReducer(reducer, {})
    useEffect(() => {
        findService(props.url).then(res => {
            dispatch({
                field: [
                    "name", "headImgUrl", "avatar", "likeNum", "fanNum", "identifyName",
                    "followNum", "sign", "additionalText", "headImgRatio"
                ],
                val: [
                    res.getName(),
                    res.getHeadImgUrl(),
                    res.getAvatar(),
                    res.getLikeNum(),
                    res.getFanNum(),
                    res.getIdentifyName(),
                    res.getFollowNum(),
                    res.getSign(),
                    res.getAdditionalText(),
                    res.getHeadImgRatio()
                ]
            })
        })
    }, [])
    return (
        <View>
            <Image source={{uri: data.headImgUrl}}
                   style={{width: "100%", height: deviceWidth * data.headImgRatio || 0}}
                   resizeMode={"center"}/>
            <View style={{backgroundColor: "#ececec"}}>
                <View style={{flexDirection: "row", marginLeft: 20}}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <Image source={{uri: data.avatar}} style={{
                            width: 80, height: 80, borderRadius: 40, marginTop: -30
                        }}/>
                        <View style={{marginLeft: 10}}>
                            <Text style={{marginTop: 5, fontWeight: "500", color: "black", fontSize:15}}>{data.name}</Text>
                            <Text style={{marginTop: 2, fontSize: 12, color: "gray"}}>{"@" + data.identifyName}</Text>
                        </View>
                    </View>
                    <View style={{marginRight: 0}}>
                        <View style={{
                            marginRight: 20,
                            backgroundColor: "#e84f4f",
                            height: 35,
                            justifyContent: "center",
                            alignContent: "center",
                            borderRadius: 5,
                            marginTop: 5
                        }}>
                            <Text style={{
                                color: "#f1ecec",
                                fontWeight: "400",
                                marginTop: -2,
                                marginRight: 25,
                                marginLeft: 25
                            }}>Subscribe</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 5,
                    marginRight: 5
                }}>
                    <Text style={{fontSize: 11, color: "#504d4d"}}>{data.additionalText}</Text>
                    <Text style={{color: "gray", fontSize:13, marginTop:5}}>{data.sign}</Text>
                </View>
                <View style={{flexDirection: "row", marginBottom: 10, marginTop: 10}}>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0.5,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{color: "#504d4d"}}>{"Followers"}</Text>
                        <Text style={{color: "#504d4d"}}>{data.fanNum}</Text>
                    </View>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0.5,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{color: "#504d4d"}}>{"Friends"}</Text>
                        <Text style={{color: "#504d4d"}}>{data.followNum}</Text>
                    </View>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        borderRightWidth: 0,
                        borderRightColor: "gray"
                    }}>
                        <Text style={{color: "#504d4d"}}>{"Likes"}</Text>
                        <Text style={{color: "#504d4d"}}>{data.likeNum}</Text>
                    </View>
                </View>
            </View>

        </View>

    )

}
export default Channel