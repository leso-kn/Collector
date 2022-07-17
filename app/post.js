import {Button, Image, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View} from "react-native";
import React, {useState} from 'react';
import TimeAgo from 'javascript-time-ago'
// English.
import en from 'javascript-time-ago/locale/en'
import ImageView from "react-native-image-viewing";
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ifWrapper from "./utils"
import {FIRST_POST, PREVIEW_POST, OTHER_POST} from "./constants";

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')
const colors = [
    "white", "red", "aqua", "green", "coral", "blue", "pink"
]

const Post = (props) => {
    const [visible, setIsVisible] = useState(false);
    const [showReplies, setShowReplies] = useState(0);
    const upvote = (
        <View style={{flexDirection: "row"}}>
            <Icon name={"arrowup"} size={20} color={"gray"}/>
            <Text style={{marginLeft: 20, color: "gray", marginRight: 20}}>{props.data.upvoteNum}</Text>
        </View>
    )
    const comment = (
        <View style={{flexDirection: "row"}}>
            <FeatherIcon name={"message-square"} size={20} color={"gray"}/>
            <Text style={{marginLeft: 20, color: "gray", marginRight: 20}}>{props.data.commentNum}</Text>
        </View>
    )
    const forward = (
        <View style={{flexDirection: "row"}}>
            <EntypoIcon name={"forward"} size={20} color={"gray"}/>
            <Text style={{marginLeft: 20, color: "gray"}}>{props.data.forwardNum}</Text>
        </View>
    )
    const titleElement = (
        <Text style={{fontWeight: "500", color: "black", fontSize: 16, marginLeft: 13}}>
            {props.data.title}
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
                    <Text style={{marginLeft: 5, marginTop: 0, color: "gray"}}>{"+" + props.data.commentNum}</Text>
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
                    width: "92%",
                    marginLeft: 16,
                    marginTop: 10,
                    borderRadius: 10,
                    marginBottom: 10
                }}
                source={{
                    uri: props.data.imagePreview,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={props.type === FIRST_POST ? FastImage.resizeMode.center : FastImage.resizeMode.cover}
            />
        </TouchableNativeFeedback>
    )
    const rootStyle = {
        maxHeight: 600,
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        marginTop: 7,
        marginBottom: 0,
        marginLeft: props.depth * 5,
        borderLeftColor: colors[props.depth],
        borderStyle: "solid",
        borderLeftWidth: 2
    }
    return (
        <View style={rootStyle}>
            <View style={{flexDirection: "row", marginTop: 10, marginLeft: 10}}>
                <Image source={{uri: props.data.avatar}}
                       style={{marginLeft: 5, width: 35, height: 35, borderRadius: 35, marginBottom: 7}}></Image>
                <View style={{flex: 1, marginLeft: 8, marginTop: props.data.subname ? 1 : 6}}>
                    <Text style={{color: "black"}}>
                        {props.data.name}
                    </Text>
                    <Text style={{color: "#9d9a9a", marginTop: 0, fontSize: 12, maxWidth: 200}}>
                        {props.data.subname}
                    </Text>
                </View>
                <View>
                    <Text style={{
                        color: "black",
                        marginRight: 25,
                        marginTop: props.data.prefix != null ? 0 : 10,
                        fontWeight: "300",
                        textAlign: "right"
                    }}>
                        {ifWrapper(props.data.prefix != null, props.data.prefix + "\n")}
                        {timeAgo.format(props.data.time)}
                    </Text>
                </View>
            </View>
            <View style={{minHeight: 35}}>
                {ifWrapper(props.type == FIRST_POST, titleElement)}
                <Text numberOfLines={4} ellipsizeMode='tail'
                      style={{
                          color: props.type == FIRST_POST ? "gray" : "black",
                          fontWeight: "400",
                          marginLeft: 13,
                          fontSize: 14,
                          marginTop: 4,
                          width: "95%"
                      }}>
                    {props.data.content}
                </Text>

                {ifWrapper(props.data.imagePreview != "", imagePreview)}
            </View>


            <View style={{flexDirection: "row", marginBottom: 10, marginTop: 3}}>
                <View style={{flex: 1, flexDirection: "row", marginLeft: 15}}>
                    {ifWrapper(props.data.upvoteNum, upvote)}
                    {ifWrapper(props.data.commentNum && props.type == FIRST_POST, comment)}
                    {ifWrapper(props.data.forwardNum, forward)}

                </View>


                <View style={{flexDirection: "row", right: 15}}>
                    {ifWrapper(props.data.replies && props.type !== FIRST_POST, replies())}
                    <FeatherIcon name={"bookmark"} size={20} color={"gray"} style={{marginLeft: 20}}/>
                    <FeatherIcon name={"share-2"} size={20} color={"gray"} style={{marginLeft: 15}}/>
                    <FeatherIcon name={"trash-2"} size={20} color={"gray"} style={{marginLeft: 15}}/>
                </View>
            </View>
            <ImageView
                images={props.data.images}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
            {ifWrapper(showReplies, (
                <Post data={props.data.replies} type={OTHER_POST} depth={props.depth + 1}/>))}
        </View>
    )
}
export default Post;