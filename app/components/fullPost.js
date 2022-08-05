import Post from "./post";
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, Text, TouchableNativeFeedback, TouchableOpacity, View} from "react-native";
import {deviceWidth, FIRST_POST, HOT_FIRST, OLD_FIRST, OTHER_POST} from "../constants";
import {findService} from "../findService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getTheme} from "../utils";

const FullPost = (packedProps) => {
    let props = packedProps.route.params
    const parentRef = useRef({IDList: []});
    const lastID = useRef(0)
    const reducer = (state, action) => {
        // console.log(JSON.stringify(state.map(x=>x.member.uname+" " +x.content.message)) + "state"+ state.length)
        // console.log(JSON.stringify(action.data.map(x=>x.member.uname+" " +x.content.message)) + "action" + action.data.length)
        let result = [...state]
        for (let item of action.data) {
            if (result.map(x => x.getIdentifyID()).includes(item.getIdentifyID()) || action.blocklist.filter(x=>x.identifyID === item.getChannelIdentifyID()).length) continue
            result.push(item)
        }
        return result
    }
    const [pn, setPn] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [comments, dispatch] = useReducer(reducer, [])
    const [sortType, setSortType] = useState(HOT_FIRST)
    const [randomID, doUpdate] = useState(0)
    const layoutMap = useRef(new Map())

    useEffect(() => {
        let blocklist
        AsyncStorage.getItem("blocklist").then(res => {
            if (!res) {
                AsyncStorage.setItem("blocklist", JSON.stringify({words: [], channels: []}))
            }
            blocklist = JSON.parse(res)?.channels
        }).then(res=>{
            if (props.parentID) {
                packedProps.navigation.setOptions({
                    headerRight: ()=>(
                        <TouchableOpacity onPress={()=>packedProps.navigation.push("FullPost", {url: props.url})}>
                            <View>
                                <Text>
                                    Origin Post
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
                findService(props.url, props.id, props.data)
                    .then(res => res.getReplies(pn, props.parentID, props.parentType)).then((res) => {
                    res?.length && dispatch({data: res, "blocklist":blocklist})
                    setHasMore(res?.hasMore())
                })
            } else if (props.type === "reposts") {
                packedProps.navigation.setOptions({
                    title: "Reposts"
                })
                findService(props.url, props.id, props.data).then(res => res.getReposts(lastID.current)).then(res => {
                    res?.length && dispatch({data: res, "blocklist":blocklist})
                    setHasMore(res?.hasMore())
                    lastID.current = res.getLastID()
                })
            } else {
                findService(props.url, props.id, props.data).then(res => {
                    parentRef.current.parentID = res.getID()
                    parentRef.current.parentType = res.getType()
                    return res.getComments(pn)
                }).then(res => {
                    res?.length && dispatch({data: res, "blocklist":blocklist})
                    setHasMore(res?.hasMore())
                })
            }
        })
    }, [pn])
    const head = (
        <View>
            <View style={{marginTop: 5, marginBottom: 10, borderBottomColor: "gray", borderBottomWidth: 0.3}}>
                <Post type={FIRST_POST} data={props.data} depth={0} url={props.url} id={props.id}
                      parentID={props.parentID} parentType={props.parentType}
                      navigation={packedProps.navigation}/>
            </View>
        </View>
    )
    const renderFunc = (comment) => {
        return (<Post navigation={packedProps.navigation} onLayout={e => {
            if (e.nativeEvent.layout.width !== deviceWidth) return
            let tempID = comment.item.getIdentifyID()
            let item = layoutMap.current.get(tempID)
            if (!item || (item && item.height < e.nativeEvent.layout.height)) {
                let offsetValue = 0
                for (let i of layoutMap.current) {
                    if (i[0] === tempID) break
                    offsetValue += i[1].height
                }
                layoutMap.current.set(tempID, {height: e.nativeEvent.layout.height, offset: offsetValue})
            }
        }} data={comment.item} parentType={props.type === "reposts" ? undefined : parentRef.current.parentType}
                      parentID={props.type === "reposts" ? undefined : parentRef.current.parentID}
                      height={layoutMap.current.get(comment.item.getIdentifyID())?.
                          height > 121 ? layoutMap.current.get(comment.item.getIdentifyID())?.height : undefined}
                      type={OTHER_POST} depth={0} url={comment.item.url || props.url} id={comment.item.id}/>)
    }

    return (
        <FlatList data={comments} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                  ListHeaderComponent={head}
                  ListEmptyComponent={<View/>}
                  extraData={randomID}
                  style={{backgroundColor: getTheme().intervalColor}}
                  keyExtractor={x => x.getIdentifyID()}
                  onEndReached={() => {
                      hasMore && setPn(pn + 1)
                  }}
                  onEndReachedThreshold={0.1}
                  getItemLayout={(data, index) => {
                      let item = layoutMap.current.get(data[index].getIdentifyID())
                      if (!item) return undefined
                      return {length: item.height, offset: item.offset, index}
                  }}
                  maxToRenderPerBatch={50}
                  windowSize={8}
                  initialNumToRender={8}
                  bounces={false}
        />
    )
}
export default FullPost;