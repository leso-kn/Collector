import {
    Image, Linking, Pressable,
    Text, TextInput,
    TouchableNativeFeedback,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import React, {useEffect, useReducer, useRef, useState} from 'react';
import Share from 'react-native-share';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {getBase64FromUrl, getTheme, reducer, shortenLargeNumber} from "../utils"
import {LinkPreview} from '@flyerhq/react-native-link-preview'
import {FIRST_POST, PREVIEW_POST, OTHER_POST, EMBEDDED_POST, deviceWidth} from "../constants";
import {findService} from "../findService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ConfirmDialog} from "react-native-simple-dialogs";
import SelectMultiple from "react-native-select-multiple";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {Dirs, FileSystem} from 'react-native-file-access';
import {showMessage} from "react-native-flash-message";
import UserAvatar from 'react-native-user-avatar';
import checkbox from "../../assets/icon-checkbox-modified.png"
import checkboxChecked from "../../assets/icon-checkbox-checked-modified.png"
import {Autolink} from "react-native-autolink";
import RenderHTML from "react-native-render-html";

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')
const he = require("he")

const titleElement = (data, type) => (
    <Text numberOfLines={[PREVIEW_POST, EMBEDDED_POST].includes(type) ? 1 : undefined} ellipsizeMode='tail' style={{
        fontWeight: "600",
        color: getTheme().textColor,
        fontSize: 16.5,
        marginLeft: 13,
        marginTop: 10,
        marginRight: 10,
    }}>
        {data.title}
    </Text>
)
const upvote = data => (
    <View style={{flexDirection: "row", marginRight: 10}}>
        <Icon name={"arrowup"} size={20} color={"gray"}/>
        <Text style={{marginLeft: 15, color: "gray", marginRight: 15}}>{shortenLargeNumber(data.upvoteNum)}</Text>
    </View>
)
const comment = data => (
    <View style={{flexDirection: "row", marginRight: 10}}>
        <View style={{marginTop: 0.5}}>
            <FeatherIcon name={"message-square"} size={20} color={"gray"}/>
        </View>
        <Text style={{marginLeft: 15, color: "gray", marginRight: 15}}>{shortenLargeNumber(data.commentNum)}</Text>
    </View>
)
const forward = (data, url, navigation) => (
    <TouchableOpacity onPress={() => {
        navigation.push("FullPost", {url: url, "data": data, id: "defaultPost", type: "reposts"})
    }}>
        <View style={{flexDirection: "row"}}>
            <View style={{marginTop: 0.6, marginLeft: 0}}>
                <FeatherIcon name={"repeat"} size={16.5} color={"gray"} style={{fontWeight: "600"}}/>
            </View>
            <Text style={{marginLeft: 15, color: "gray"}}>{shortenLargeNumber(data.repostNum)}</Text>
        </View>
    </TouchableOpacity>
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
    useEffect(() => {
        findService(props.url, props.id, props.data).then(res => {
            if (!mounted1.current) return
            dispatch({
                "field": [
                    "name", "avatar", "upvoteNum", "commentNum", "repostNum", "images", "prefix", "title", "subname",
                    "pubtime", "refPost", "content", "highLightUrl", "identifyName", "id", "type", "identifyID",
                    "channelIdentifyID", "channelUrl", "parentID", "parentType", "outerContentURLs", "htmlContent"
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
                    res.getHighlightUrl(),
                    res.getIdentifyName(),
                    res.getID(),
                    res.getType(),
                    res.getIdentifyID(),
                    res.getChannelIdentifyID(),
                    res.getChannelUrl(),
                    res.getParentID(),
                    res.getParentType(),
                    res.getOuterContentURLs(),
                    res.getHTMLContent()
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
    }, [data, dialogVisible1, dialogVisible2])

    const rootStyle = {
        backgroundColor: getTheme().postBackGroundColor,
        borderRadius: 0,
        marginTop: 0,
        marginBottom: 0,
        height: props.height
    }
    return (
        <TouchableNativeFeedback onPress={() => {
            let params = {
                url: props.url,
                "data": data,
                id: "defaultPost",
                parentID: props.parentID || data.parentID,
                parentType: props.parentType || data.parentType
            }
            props.navigation.push("FullPost", params)
        }} disabled={![PREVIEW_POST, OTHER_POST].includes(props.type)}>
            <View>
                <View style={rootStyle} onLayout={props.onLayout}>
                    <View style={{flexDirection: "row", marginTop: 10, marginLeft: 10, marginBottom: -5}}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.push("Channel", {url: data.channelUrl})
                        }}>
                            <UserAvatar src={data.avatar}
                                        name={data.name}
                                        size={35}
                                   style={{
                                       marginLeft: 5,
                                       width: 35,
                                       height: 35,
                                       borderRadius: 35,
                                       marginBottom: 7
                                   }}></UserAvatar>
                        </TouchableOpacity>
                        <View style={{flex: 1, marginLeft: 10, marginTop: data.subname ? 1 : 6}}>
                            <Text style={{color: getTheme().textColor}}>
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
                                color: getTheme().textColor,
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
                            <Pressable onLongPress={() => props.navigation.push("FreeCopy", {
                                content: data.content
                            })} disabled={props.type !== FIRST_POST}>
                                <Autolink
                                    numberOfLines={[PREVIEW_POST, EMBEDDED_POST].includes(props.type) ? 4 : undefined}
                                    ellipsizeMode='tail'
                                    url
                                    text={data.content}
                                    style={{
                                        color: props.type === FIRST_POST ? "gray" : getTheme().textColor,
                                        fontWeight: "400",
                                        marginLeft: 13,
                                        fontSize: 14.5,
                                        marginTop: 10,
                                        marginRight: 13
                                    }}>
                                </Autolink>
                            </Pressable> : null}
                        {data.htmlContent && props.type === FIRST_POST ? <View
                            style={{
                                color: props.type === FIRST_POST ? "gray" : getTheme().textColor,
                                fontWeight: "400",
                                marginLeft: 13,
                                marginRight: 13,
                                fontSize: 14.5,
                                marginTop: 10,
                                maxWidth:deviceWidth*0.92
                            }}
                        ><RenderHTML
                            contentWidth={deviceWidth * 0.92}
                            enableExperimentalBRCollapsing={true}
                            enableExperimentalGhostLinesPrevention={true}
                            enableExperimentalMarginCollapsing={true}
                            ignoredStyles={['width']}
                            source={{html: he.decode(data.htmlContent).replaceAll("\\", "")}}
                        /></View> : null}
                        {data.outerContentURLs && data.outerContentURLs?.filter(x => x.type === "video").length ?
                            <TouchableWithoutFeedback
                                onPress={() => Linking.openURL(data.outerContentURLs?.filter(x => x.type === "video")[0].uri)}>
                                <View style={{marginTop: 10, marginBottom: 10}}>
                                    <Text style={{
                                        color: getTheme().linkColor,
                                        marginLeft: 15,
                                        textDecorationLine: "underline"
                                    }}>
                                        Watch the origin video</Text>
                                </View>
                            </TouchableWithoutFeedback> : null}
                        {data.outerContentURLs && data.outerContentURLs?.filter(x => x.type === "audio").length ?
                            <TouchableWithoutFeedback
                                onPress={() => Linking.openURL(data.outerContentURLs?.filter(x => x.type === "audio")[0].uri)}>
                                <View style={{marginTop: 10, marginBottom: 10}}>
                                    <Text style={{
                                        color: getTheme().linkColor,
                                        marginLeft: 15,
                                        textDecorationLine: "underline"
                                    }}>
                                        Origin audio</Text>
                                </View>
                            </TouchableWithoutFeedback> : null}
                        {data.outerContentURLs && data.outerContentURLs?.filter(x => x.type === "link").length ?
                            <TouchableWithoutFeedback
                                onPress={() => Linking.openURL(data.outerContentURLs?.filter(x => x.type === "link")[0].uri)}>
                                <View style={{marginTop: 10, marginBottom: 10}}>
                                    <Text style={{
                                        color: getTheme().linkColor,
                                        marginLeft: 15,
                                        textDecorationLine: "underline"
                                    }}>
                                        Origin link</Text>
                                </View>
                            </TouchableWithoutFeedback> : null}
                        {data.images?.length ? (
                            <TouchableWithoutFeedback onPress={() => {
                                setIsVisible(true)
                            }}>
                                <View>
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
                                    {data.images?.length > 1 ?
                                        <View style={{
                                            position: "absolute",
                                            left: 30,
                                            top: 22,
                                            borderRadius: 12,
                                            width: 24,
                                            height: 24,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "black"
                                        }}>
                                            <MaterialIcons name={"photo-library"} size={18} color={"white"}/>
                                        </View> : null}
                                </View>
                            </TouchableWithoutFeedback>
                        ) : null}
                        {props.type !== OTHER_POST && data.refPost ? (
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
                                    <LinkPreview showImg={data.highLightUrl.showImg} text={data.highLightUrl.uri}
                                                 isDarkTheme={getTheme().isDarkTheme}
                                                 containerStyle={{height: data.highLightUrl.showImg ? 320 : 120}}/>
                                </View>
                            </View>
                        ) : null}
                    </View>

                    <View style={{flexDirection: "row", marginBottom: 10, marginTop: 18}}>
                        <View style={{flex: 1, flexDirection: "row", marginLeft: 15}}>
                            {data.upvoteNum || data.upvoteNum === 0 ? upvote(data) : null}
                            {data.commentNum ? comment(data) : null}
                            {data.repostNum ? forward(data, props.url, props.navigation) : null}
                        </View>

                        {props.type !== EMBEDDED_POST ?
                            <View style={{flexDirection: "row", right: 15, marginTop: -1.05}}>
                                {/*{props.type === FIRST_POST ?<FeatherIcon name={"corner-up-left"} size={20} color={"gray"} style={{marginLeft: 20}}/>:null}*/}
                                <TouchableNativeFeedback onPress={() => {
                                    setDialogVisible1(true)
                                }}>
                                    <FeatherIcon name={"bookmark"} size={20} color={"gray"} style={{marginLeft: 15}}/>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => {
                                    Share.open({
                                        title: data.title,
                                        url: props.url
                                    })
                                }}>
                                    <FeatherIcon name={"share-2"} size={20} color={"gray"} style={{marginLeft: 10}}/>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => {
                                    setDialogVisible2(true)
                                }}>
                                    <FeatherIcon name={"trash-2"} size={20} color={"gray"} style={{marginLeft: 10}}/>
                                </TouchableNativeFeedback>
                            </View> : null}
                    </View>

                    <ImageView
                        images={data.images}
                        imageIndex={0}
                        visible={visible}
                        FooterComponent={({imageIndex}) => (
                            <View style={{flexDirection: "row"}}>
                                <Text style={{
                                    color: "white",
                                    flex: 1,
                                    marginLeft: 25,
                                    marginBottom: 20,
                                    fontSize: 18,
                                    fontWeight: "500"
                                }}>
                                    {`${imageIndex + 1}/${data.images.length}`}
                                </Text>
                                <View style={{marginRight: 20, marginTop: 0}}>
                                    <TouchableOpacity
                                        onPress={() => getBase64FromUrl(data.images[imageIndex].uri).then(res => Share.open({
                                            title: "Share image",
                                            url: res,
                                        }))}>
                                        <MaterialIcons name={"share"} size={21} color={"white"}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginRight: 20, marginTop: 0}}>
                                    <TouchableOpacity
                                        onPress={() => getBase64FromUrl(data.images[imageIndex].uri).then(res => {
                                                let imageData = res.split("data:image/png;base64,")[1]
                                                let path = `/${data.identifyID + "-" + imageIndex}.png`
                                                return FileSystem.exists(Dirs.SDCardDir + "/Pictures/Collector")
                                                    .then(res => !res && FileSystem.mkdir(Dirs.SDCardDir + "/Pictures/Collector"))
                                                    .then(res => FileSystem.writeFile(Dirs.CacheDir + path, imageData, "base64")).then(res => path)
                                            }
                                        ).then(path => FileSystem.cp(Dirs.CacheDir + path, Dirs.SDCardDir + "/Pictures/Collector" + path)).then(res => showMessage({
                                            message: "Success",
                                            type: "success",
                                            style: {justifyContent: "center", alignItems: "center", marginTop: -3},
                                            statusBarHeight: 0,
                                        }))}>
                                        <MaterialIcons name={"file-download"} size={21} color={"white"}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        onRequestClose={() => setIsVisible(false)}
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
                            onPress: () => setDialogVisible(true),
                            titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity}
                        }}
                        negativeButton={{
                            title: "Cancel",
                            onPress: () => {
                                setDialogVisible1(false)
                            },
                            titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity}
                        }}
                        positiveButton={{
                            title: "OK",
                            titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                            onPress: () => {
                                let newData = {...bookmarks}
                                for (let item of selected) {
                                    if (newData[item.label].filter(x => x.identifyID === data.identifyID).length > 0) continue
                                    newData[item.label].push({
                                        ...data,
                                        parentID: props.parentID || data.parentID,
                                        parentType: props.parentType || data.parentType,
                                        url: props.url
                                    })
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
                                        rowStyle={{backgroundColor: getTheme().postBackGroundColor}}
                                        checkboxSource={getTheme().isDarkTheme ? checkbox : undefined}
                                        selectedCheckboxSource={getTheme().isDarkTheme ? checkboxChecked : undefined}
                                        items={bookmarks ? Object.entries(bookmarks).map(x => x[0]) : []}
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
                                       style={{
                                           borderWidth: 0.3,
                                           borderColor: getTheme().borderColor,
                                           paddingLeft: 10
                                       }}/>
                        </View>
                    </ConfirmDialog>
                    <ConfirmDialog
                        dialogStyle={{backgroundColor: getTheme().postBackGroundColor}}
                        titleStyle={{color: getTheme().textColor}}
                        contentStyle={{color: getTheme().postBackGroundColor}}
                        title="Block"
                        visible={dialogVisible2}
                        onTouchOutside={() => setDialogVisible2(false)}
                        negativeButton={{
                            titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
                            title: "Cancel",
                            onPress: () => {
                                changeText("")
                                setDialogVisible2(false)
                            }
                        }}
                        positiveButton={{
                            titleStyle: {color: getTheme().buttonColor, opacity: getTheme().buttonOpacity},
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
                                            identifyID: data.channelIdentifyID,
                                            identifyName: data.identifyName,
                                            isRSS: props.data.url ==="RSSItem"
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
                                            rowStyle={{backgroundColor: getTheme().postBackGroundColor}}
                                            checkboxSource={getTheme().isDarkTheme ? checkbox : undefined}
                                            selectedCheckboxSource={getTheme().isDarkTheme ? checkboxChecked : undefined}
                                // items={['Block user', "Create new block word"]}
                                            items={['Block user']}
                                            selectedItems={selected1}/>
                            {/*<TextInput value={text}*/}
                            {/*           placeholder={"word to block"}*/}
                            {/*           onChangeText={(value) => changeText(value)}*/}
                            {/*           style={{borderWidth: 0.3, borderColor: "black", paddingLeft: 10}}/>*/}
                        </View>
                    </ConfirmDialog>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
})
export default Post;