import {
    Image,
    Text, TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";
import React, {useEffect, useReducer, useRef, useState} from 'react';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {isBlocked, reducer} from "../utils"
import {LinkPreview} from '@flyerhq/react-native-link-preview'
import {FIRST_POST, PREVIEW_POST, OTHER_POST, EMBEDDED_POST, deviceWidth} from "../constants";
import {findService} from "../findService";
import {mobileSpaceUrl} from "../services/bilispace/BiliSpaceLinks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ConfirmDialog} from "react-native-simple-dialogs";
import SelectMultiple from "react-native-select-multiple";

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')
const colors = [
    "white", "red", "aqua", "green", "coral", "blue", "pink"
]

const titleElement = (data, type) => (
    <Text numberOfLines={[PREVIEW_POST, EMBEDDED_POST].includes(type) ? 1 : undefined} ellipsizeMode='tail' style={{
        fontWeight: "600",
        color: "black",
        marginBottom: -5,
        fontSize: 16.5,
        marginLeft: 13,
        marginTop: 10
    }}>
        {data.title}
    </Text>
)
const upvote = data => (
    <View style={{flexDirection: "row", marginRight: 10}}>
        <Icon name={"arrowup"} size={20} color={"gray"}/>
        <Text style={{marginLeft: 15, color: "gray", marginRight: 15}}>{data.upvoteNum}</Text>
    </View>
)
const comment = data => (
    <View style={{flexDirection: "row", marginRight:10}}>
        <View style={{marginTop:0.5}}>
            <FeatherIcon name={"message-square"} size={20} color={"gray"}/>
        </View>
        <Text style={{marginLeft: 15, color: "gray", marginRight: 15}}>{data.commentNum}</Text>
    </View>
)
const forward = data => (
    <View style={{flexDirection: "row"}}>
        <View style={{marginTop:0.6, marginLeft:0}}>
            <FeatherIcon name={"repeat"} size={16.5} color={"gray"} style={{fontWeight:"600"}}/>
        </View>
        <Text style={{marginLeft: 15, color: "gray"}}>{data.repostNum}</Text>
    </View>
)
const Post = React.memo((props) => {
    const [visible, setIsVisible] = useState(false);
    const [selected, setSelected] = useState()
    const [bookmarks, setBookmarks] = useState()
    const [mode, setMode] = useState(0)
    const [showLoadMore, setShowLoadMore] = useState(0);
    const [selected1, setSelected1] = useState()
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogVisible1, setDialogVisible1] = useState(false)
    const [text, changeText] = useState("")
    const [dialogVisible2, setDialogVisible2] = useState(false)
    const [pn, setPn] = useState(0)
    const [blocklist, setBlocklist] = useState()
    const [data, dispatch] = useReducer(reducer, {})
    const mounted1 = useRef(true)
    const mounted3 = useRef(true)
    const block = useRef(false)
    useEffect(() => {
        findService(props.url, props.id, props.data).then(res => {
            if (!mounted1.current) return
            dispatch({
                "field": [
                    "name", "avatar", "upvoteNum", "commentNum", "repostNum", "images", "prefix", "title", "subname",
                    "pubtime", "refPost", "content", "replies", "highLightUrl", "identifyName", "id", "type", "identifyID",
                    "channelIdentifyID", "channelUrl"
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
                    res.getRefPost(),
                    res.getContent(),
                    res.getPreviewReplies(),
                    res.getHighLightUrl(),
                    res.getIdentifyName(),
                    res.getID(),
                    res.getType(),
                    res.getIdentifyID(),
                    res.getChannelIdentifyID(),
                    res.getChannelUrl()
                ]
            })
        })
        return () => mounted1.current = false
    }, [])
    useEffect(() => {
        if (Object.keys(data).length) {
            AsyncStorage.getItem("blocklist").then(res => {
                if (!res) {
                    AsyncStorage.setItem("blocklist", JSON.stringify({words: [], channels: []}))
                }
                let tempList = JSON.parse(res) || {words: [], channels: []}
                block.current = isBlocked(data, tempList)
                setBlocklist(tempList)
                setSelected(tempList.channels.filter(x => {
                    return x.identifyID === data.channelIdentifyID
                }).map(x => {
                    return {label: x.name, value: x.name}
                }))
            })

            AsyncStorage.getItem("bookmarks").then(res => {
                setSelected(Object.entries(JSON.parse(res)).filter(x => {
                    let flag = false
                    for (let i of x[1]) {
                        flag = flag || (i.identifyID === data.identifyID)
                    }
                    return flag
                }).map(x => {
                    return {label: x[0], value: x[0]}
                }))
                setBookmarks(JSON.parse(res))
            })
        }
        return () => mounted3.current = false
    }, [data])

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
        borderLeftWidth: 2,
        height: props.height
    }
    if (block.current) return null
    return (
        <TouchableNativeFeedback onPress={() => {
            let params = {url: props.url, "data": data, id: "defaultPost"}
            if (props.type === OTHER_POST) {
                params.parentID = props.parentID
                params.parentType = props.parentType
            }
            props.navigation.push("FullPost", params)
        }} disabled={![PREVIEW_POST, OTHER_POST].includes(props.type)}>
            <View>
                <View style={rootStyle} onLayout={props.onLayout}>
                    <View style={{flexDirection: "row", marginTop: 10, marginLeft: 10, marginBottom: -5}}>
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
                            {data.prefix ? (
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
                            ) : null}

                            <Text style={{
                                color: "black",
                                marginRight: 20,
                                marginTop: data.prefix ? -15 : 5,
                                fontWeight: "300",
                                fontSize: 13,
                                textAlign: "right"
                            }}>
                                {data.pubtime && timeAgo.format(new Date(data.pubtime))}
                            </Text>
                        </View>
                    </View>
                    <View style={{minHeight: 25}}>
                        {props.type !== OTHER_POST && data.title ? titleElement(data) : null}
                        {data.content ?
                            <Text numberOfLines={[PREVIEW_POST, EMBEDDED_POST].includes(props.type) ? 4 : undefined}
                                  ellipsizeMode='tail'
                                  style={{
                                      color: props.type === FIRST_POST ? "gray" : "black",
                                      fontWeight: "400",
                                      marginLeft: 13,
                                      fontSize: 14.5,
                                      marginTop: 10,
                                      width: "95%"
                                  }}>
                                {data.content}
                            </Text> : null}

                        {data.images ? imagePreview : null}
                        {data.refPost ? (
                            <TouchableOpacity onPress={() => (props.navigation.push("FullPost", {
                                url: data.refPost?.url,
                                "data": data.refPost,
                                id: "biliRefPost"
                            }))}>
                                <View style={{justifyContent: "center", alignItems: 'center', marginTop: 10}}>
                                    <View
                                        style={{
                                            width: "85%",
                                            marginLeft: -10,
                                            borderWidth: 0.5,
                                            borderColor: "gray",
                                            borderRadius: 5,
                                            marginTop: 10
                                        }}>
                                        <Post depth={0} type={EMBEDDED_POST} url={data.refPost?.url} data={data.refPost}
                                              id={"biliRefPost"}
                                              navigation={props.navigation}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                        {data.highLightUrl ? (
                            <View style={{justifyContent: "center", alignItems: 'center', marginTop: 10}}>
                                <View
                                    style={{
                                        width: "85%",
                                        marginLeft: -10,
                                        borderWidth: 0.5,
                                        borderColor: "gray",
                                        borderRadius: 5,
                                        marginTop: 10
                                    }}>
                                    <LinkPreview text={data.highLightUrl} containerStyle={{height: 320}}></LinkPreview>
                                </View>
                            </View>
                        ) : null}
                    </View>

                    <View style={{flexDirection: "row", marginBottom: 10, marginTop: 18}}>
                        <View style={{flex: 1, flexDirection: "row", marginLeft: 15}}>
                            {data.upvoteNum || data.upvoteNum === 0 ? upvote(data) : null}
                            {data.commentNum ? comment(data) : null}
                            {data.repostNum ? forward(data) : null}
                        </View>

                        {props.type !== EMBEDDED_POST?<View style={{flexDirection: "row", right: 15, marginTop: -1.05}}>
                            {/*{props.type === FIRST_POST ?<FeatherIcon name={"corner-up-left"} size={20} color={"gray"} style={{marginLeft: 20}}/>:null}*/}
                            <TouchableNativeFeedback onPress={() => {
                                setDialogVisible1(true)
                            }}>
                                <FeatherIcon name={"bookmark"} size={20} color={"gray"} style={{marginLeft: 15}}/>
                            </TouchableNativeFeedback>
                            <FeatherIcon name={"share-2"} size={20} color={"gray"} style={{marginLeft: 10}}/>
                            <TouchableNativeFeedback onPress={() => {
                                setDialogVisible2(true)
                            }}>
                                <FeatherIcon name={"trash-2"} size={20} color={"gray"} style={{marginLeft: 10}}/>
                            </TouchableNativeFeedback>
                        </View>:null}
                    </View>

                    <ImageView
                        images={data.images}
                        imageIndex={0}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                    />
                    <ConfirmDialog
                        title={"Add to"}
                        visible={dialogVisible1}
                        onTouchOutside={() => {
                            setDialogVisible1(false)
                        }}
                        myButton={{
                            title: "New folder",
                            onPress: () => setDialogVisible(true)
                        }}
                        negativeButton={{
                            title: "Cancel",
                            onPress: () => {
                                setDialogVisible1(false)
                            }
                        }}
                        positiveButton={{
                            title: "OK",
                            onPress: () => {
                                let newData = {...bookmarks}
                                for (let item of selected) {
                                    if (newData[item.label].filter(x => x.identifyID === data.identifyID).length > 0) continue
                                    newData[item.label].push(data)
                                }
                                for (let item of Object.entries(bookmarks).filter(x => !selected.filter(y => y.label === x[0]).length)) {
                                    newData[item[0]] = newData[item[0]].filter(x => x.identifyID !== data.identifyID)
                                }
                                setBookmarks(newData)
                                AsyncStorage.setItem("bookmarks", JSON.stringify(newData))
                                setDialogVisible1(false)
                            }
                        }}>
                        <SelectMultiple onSelectionsChange={x => setSelected(x)}
                                        items={bookmarks ? Object.entries(bookmarks).map(x => x[0]) : []}
                                        selectedItems={selected}/>
                    </ConfirmDialog>

                    <ConfirmDialog
                        title="Add folder"
                        visible={dialogVisible}
                        onTouchOutside={() => setDialogVisible(false)}
                        negativeButton={{
                            title: "Cancel",
                            onPress: () => {
                                changeText("")
                                setDialogVisible(false)
                            }
                        }}
                        positiveButton={{
                            title: "OK",
                            onPress: () => {
                                changeText("")
                                if (bookmarks[text] !== undefined) {
                                    alert("Name already exists")
                                } else {
                                    bookmarks[text] = []
                                    setBookmarks(bookmarks)
                                    AsyncStorage.setItem("bookmarks", JSON.stringify(bookmarks))
                                    setDialogVisible(false)
                                }

                            }
                        }}>
                        <View>
                            <TextInput value={text}
                                       placeholder={"Folder Name"}
                                       onChangeText={(value) => changeText(value)}
                                       style={{borderWidth: 0.3, borderColor: "black", paddingLeft: 10}}/>
                        </View>
                    </ConfirmDialog>
                    <ConfirmDialog
                        title="Block"
                        visible={dialogVisible2}
                        onTouchOutside={() => setDialogVisible2(false)}
                        negativeButton={{
                            title: "Cancel",
                            onPress: () => {
                                changeText("")
                                setDialogVisible2(false)
                            }
                        }}
                        positiveButton={{
                            title: "OK",
                            onPress: () => {
                                let newData = {...blocklist}
                                if (text) {
                                    if (text in blocklist.words) {
                                        alert("Word exists")
                                    } else {
                                        newData.words.push(text)
                                    }
                                }
                                if (selected1.length) {
                                    if (newData.channels.filter(x => x.identifyID === data.channelIdentifyID).length === 0) {
                                        newData.channels.push({
                                            name: data.name,
                                            avatar: data.avatar,
                                            url: data.channelUrl,
                                            identifyID: data.channelIdentifyID
                                        })
                                    }
                                } else {
                                    newData.channels.filter(x => x.identifyID !== data.channelIdentifyID)
                                }
                                setBlocklist(newData)
                                AsyncStorage.setItem("blocklist", JSON.stringify(newData))
                                changeText("")
                                setDialogVisible2(false)
                            }
                        }}>
                        <View>
                            <SelectMultiple onSelectionsChange={x => setSelected1(x)}
                                            items={['Block user', "Create new block word"]}
                                            selectedItems={selected1}/>
                            <TextInput value={text}
                                       placeholder={"word to block"}
                                       onChangeText={(value) => changeText(value)}
                                       style={{borderWidth: 0.3, borderColor: "black", paddingLeft: 10}}/>
                        </View>
                    </ConfirmDialog>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
})
export default Post;