import {Button, Image, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View} from "react-native";
import React, {useEffect, useReducer, useState} from 'react';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ifWrapper, {reducer} from "../utils"
import {LinkPreview} from '@flyerhq/react-native-link-preview'
import {FIRST_POST, PREVIEW_POST, OTHER_POST, EMBEDDED_POST} from "../constants";
import {findService} from "../findService";
import {mobileSpaceUrl} from "../services/bilispace/BiliSpaceLinks";

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')
const colors = [
    "white", "red", "aqua", "green", "coral", "blue", "pink"
]

const Post = (props) => {
    const [visible, setIsVisible] = useState(false);
    const [showReplies, setShowReplies] = useState(0);
    const [showLoadMore, setShowLoadMore] = useState(0);
    const [pn, setPn] = useState(0)
    const [data, dispatch] = useReducer(reducer, {})
    useEffect(() => {
        findService(props.url, props.id, props.data).then(res => {
            dispatch({
                "field": [
                    "name", "avatar", "upvoteNum", "commentNum", "repostNum", "images", "prefix", "title", "subname",
                    "pubtime", "refPostUrl", "content", "id", "replies", "highLightUrl", "identifyName"
                ], "val": [
                    res.getName(),
                    res.getAvatar(),
                    res.getUpvoteNum(),
                    res.getCommentNum(),
                    res.getRepostNum(),
                    res.getImages(),
                    res.getPrefix(),
                    res.getTitle(),
                    res.getSubName(),
                    res.getPubTime(),
                    res.getRefPostUrl(),
                    res.getContent(),
                    res.getID(),
                    res.getPreviewReplies(),
                    res.getHighLightUrl(),
                    res.getIdentifyName()
                ]
            })
        })
    }, [])
    useEffect(() => {
        setShowLoadMore(data.replies?.length < data.commentNum)
    })
    useEffect(() => {
        props.parentID && props.type === OTHER_POST && data.replies?.length && pn && findService(props.url, props.id, props.data)
            .then(res => res.getReplies(pn, props.parentID, props.parentType)).then((res) => {
                res.data?.data?.replies?.length && dispatch({
                    field: ["replies"],
                    val: [[...res.data.data.replies]]
                })
                setShowLoadMore(res.data?.data?.replies?.length === 20)
            })
    }, [pn])
    const upvote = (
        <View style={{flexDirection: "row"}}>
            <Icon name={"arrowup"} size={20} color={"gray"}/>
            <Text style={{marginLeft: 20, color: "gray", marginRight: 20}}>{data.upvoteNum}</Text>
        </View>
    )
    const comment = (
        <View style={{flexDirection: "row"}}>
            <FeatherIcon name={"message-square"} size={20} color={"gray"}/>
            <Text style={{marginLeft: 20, color: "gray", marginRight: 20}}>{data.commentNum}</Text>
        </View>
    )
    const forward = (
        <View style={{flexDirection: "row"}}>
            <EntypoIcon name={"forward"} size={20} color={"gray"}/>
            <Text style={{marginLeft: 20, color: "gray"}}>{data.repostNum}</Text>
        </View>
    )
    const titleElement = (
        <Text style={{fontWeight: "600", color: "black",marginBottom:-5, fontSize: 16, marginLeft: 13, marginTop:10}}>
            {data.title}
        </Text>
    )
    const replies = () => {
        const [mode, setMode] = useState(0)
        const downElement = (
            <TouchableOpacity onPress={() => {
                setMode(1)
                setShowReplies(1)
            }}>
                <View style={{flexDirection: "row"}}>
                    <Icon name={"down"} size={20} color={"gray"}/>
                    <Text style={{marginLeft: 5, marginTop: 0, color: "gray"}}>{"+" + data.commentNum}</Text>
                </View>
            </TouchableOpacity>
        )
        const upElement = (
            <TouchableOpacity onPress={() => {
                setMode(0)
                setShowReplies(0)
            }}>
                <View style={{flexDirection: "row"}}>
                    <Icon name={"up"} size={20} color={"gray"}/>
                </View>
            </TouchableOpacity>
        )
        return mode ? upElement : downElement
    }

    const imagePreview = (
        <TouchableNativeFeedback onPress={() => {
            setIsVisible(true)
        }}>
            <FastImage
                style={{
                    height: 200,
                    width: "90%",
                    marginLeft: 16,
                    marginTop: 10,
                    borderRadius: 10,
                    marginBottom: 0
                }}
                source={{
                    uri: data.images && data.images[0].uri,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={props.type === FIRST_POST ? FastImage.resizeMode.center : FastImage.resizeMode.cover}
            />
        </TouchableNativeFeedback>
    )

    const loadMore = (
        <View style={{
            marginLeft: (props.depth + 1) * 5,
            borderLeftColor: colors[props.depth + 1],
            borderStyle: "solid",
            borderLeftWidth: 0,
            marginBottom: 0,
            marginTop: -5,
            height: 35,
            alignItems: "center",
            justifyContent: "center"
        }}>
            <TouchableOpacity onPress={() => {
                showLoadMore && setPn(pn + 1)
            }}>
                <Text style={{color: "black"}}>
                    {/*TODO:multi-language*/}
                    Load More
                </Text>
            </TouchableOpacity>
        </View>
    )
    const rootStyle = {
        backgroundColor: "#FFFFFF",
        borderRadius: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: props.depth * 5,
        borderLeftColor: colors[props.depth],
        borderStyle: "solid",
        borderLeftWidth: 2
    }
    return (
        <TouchableNativeFeedback onPress={() => {
            props.navigation.push("FullPost", {url: props.url})
        }} disabled={props.type !== PREVIEW_POST}>
            <View style={rootStyle}>
                <View style={{flexDirection: "row", marginTop: 10, marginLeft: 10, marginBottom:-5}}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.push("Channel", {url: mobileSpaceUrl + data.identifyName})
                    }}>
                        <Image source={{uri: data.avatar}}
                               style={{
                                   marginLeft: 5,
                                   width: 35,
                                   height: 35,
                                   borderRadius: 35,
                                   marginBottom: 7
                               }}></Image>
                    </TouchableOpacity>
                    <View style={{flex: 1, marginLeft: 10, marginTop: data.subname ? 1 : 6}}>
                        <Text style={{color: "black"}}>
                            {data.name}
                        </Text>
                        <Text style={{color: "#9d9a9a", marginTop: 0, fontSize: 12, maxWidth: 200}}>
                            {data.subname}
                        </Text>
                    </View>
                    <View>
                        {ifWrapper(data.prefix, (
                            <Text style={{
                                color: "gray",
                                marginRight: 20,
                                marginTop: -5,
                                fontSize: 11,
                                fontWeight: "300",
                                textAlign: "right"
                            }}>
                                {data.prefix + "\n"}
                            </Text>
                        ))}

                        <Text style={{
                            color: "black",
                            marginRight: 20,
                            marginTop: data.prefix ? -15 : 5,
                            fontWeight: "300",
                            fontSize: 13,
                            textAlign: "right"
                        }}>
                            {data.pubtime && timeAgo.format(data.pubtime)}
                        </Text>
                    </View>
                </View>
                <View style={{minHeight: 25}}>
                    {ifWrapper(props.type !== OTHER_POST && data.title, titleElement)}
                    <Text numberOfLines={props.type === PREVIEW_POST ? 4 : undefined} ellipsizeMode='tail'
                          style={{
                              color: props.type === FIRST_POST ? "gray" : "black",
                              fontWeight: "400",
                              marginLeft: 13,
                              fontSize: 14,
                              marginTop: 10,
                              width: "95%"
                          }}>
                        {data.content}
                    </Text>

                    {ifWrapper(data.images, imagePreview)}
                    {ifWrapper(data.refPostUrl, (
                        <TouchableOpacity onPress={() => (props.navigation.push("FullPost", {url: data.refPostUrl}))}>
                            <View style={{justifyContent: "center", alignItems: 'center', marginTop: 10}}>
                                <View
                                    style={{
                                        width: "85%",
                                        marginLeft: -10,
                                        borderWidth: 0.5,
                                        borderColor: "gray",
                                        borderRadius: 5
                                    }}>
                                    <Post depth={0} type={EMBEDDED_POST} url={data.refPostUrl}
                                          navigation={props.navigation}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {ifWrapper(data.highLightUrl, (
                        <View style={{justifyContent: "center", alignItems: 'center' , marginTop: 10}}>
                            <View
                                style={{
                                    width: "85%",
                                    marginLeft: -10,
                                    borderWidth: 0.5,
                                    borderColor: "gray",
                                    borderRadius: 5
                                }}>
                                <LinkPreview text={data.highLightUrl}></LinkPreview>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{flexDirection: "row", marginBottom: 10, marginTop: 18}}>
                    <View style={{flex: 1, flexDirection: "row", marginLeft: 15}}>
                        {ifWrapper(data.upvoteNum != null, upvote)}
                        {ifWrapper(data.commentNum && props.type !== OTHER_POST, comment)}
                        {ifWrapper(data.forwardNum, forward)}
                    </View>

                    <View style={{flexDirection: "row", right: 15}}>
                        {ifWrapper(data.replies?.length > 0 && props.type === OTHER_POST, replies())}
                        <FeatherIcon name={"bookmark"} size={20} color={"gray"} style={{marginLeft: 20}}/>
                        <FeatherIcon name={"share-2"} size={20} color={"gray"} style={{marginLeft: 15}}/>
                        <FeatherIcon name={"trash-2"} size={20} color={"gray"} style={{marginLeft: 15}}/>
                    </View>
                </View>

                <ImageView
                    images={data.images}
                    imageIndex={0}
                    visible={visible}
                    onRequestClose={() => setIsVisible(false)}
                />
                {ifWrapper(showReplies, data.replies?.map(reply => (
                    <Post url={"biliComment"} data={reply} type={OTHER_POST} depth={props.depth + 1}/>)))}
                {ifWrapper(showReplies && showLoadMore, loadMore)}
            </View>
        </TouchableNativeFeedback>
    )
}
export default Post;