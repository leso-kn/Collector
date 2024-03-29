import React, {useEffect, useReducer, useRef, useState} from 'react';
import {deviceWidth, HOT_FIRST, PREVIEW_POST} from "../constants";
import {findService} from "../findService";
import Post from "./post";
import {FlatList, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getDomain, getRequestLimit, getTheme} from "../utils";
import {getItemLayout, onLayout} from "./renderPost";

const reducer = (state, action) => {
    let result = [...state]
    let tempData = [...action.data]
    if (action.sort)
        tempData = tempData.sort((a, b) => new Date(a.getTime()) < new Date(b.getTime()))
    for (let item of tempData) {
        if (result.map(x => x.getIdentifyID()).includes(item.getIdentifyID()) || action.blocklist?.filter(x=>x.identifyID === item.getChannelIdentifyID()).length) continue
        result.push(item)
    }
    return result
}

function renderFunc(layoutMap, props) {
    return (post)=>{
        return (
            <Post type={PREVIEW_POST} depth={0} onLayout={onLayout(post, layoutMap)} url={post.item.url} data={post.item}
                  height={layoutMap.current.get(post.item.getIdentifyID())?.height > 121 ? layoutMap.current.get(post.item.getIdentifyID())?.height : undefined}
                  navigation={props.navigation}/>)
    }
}

export const Posts = React.memo((props) => {
    const [pn, setPn] = useState(1)
    const refContainer = useRef({hasMores: [], lastIDs: [], notFetch: {}})
    const [posts, dispatch] = useReducer(reducer, [])
    const [sortType, setSortType] = useState(HOT_FIRST)
    const [showLoadMore, setShowLoadMore] = useState(0);
    const requestControl = useRef([])
    const requestStatus = useRef({expect: 0, get: 0})
    const tempResultPool = useRef({})
    const tempResultQueue = useRef([])
    const layoutMap = useRef(new Map())

    useEffect(() => {
        let blocklist
        AsyncStorage.getItem("blocklist").then(res => {
            if (!res) {
                AsyncStorage.setItem("blocklist", JSON.stringify({words: [], channels: []}))
            }
            blocklist = JSON.parse(res)?.channels
        }).then(res=>{
            for (const [index, url] of props.urls.entries()) {
                if (refContainer.current.notFetch[url]) continue
                if (pn !== 1) {
                    if (!refContainer.current.hasMores[index]) continue
                }
                let currentTime = Math.floor(Date.now() / 1000)
                if (!requestControl.current.length) {
                    requestControl.current.push({time: currentTime, count: {[getDomain(url)]: 1}})
                } else {
                    let lastItem = requestControl.current[requestControl.current.length - 1]
                    if (lastItem.time < currentTime) {
                        requestControl.current = []
                        requestControl.current.push({time: currentTime, count: {[getDomain(url)]: 1}})
                    } else {
                        lastItem.count[getDomain(url)] >= getRequestLimit(getDomain(url)) ?
                            requestControl.current.push({time: lastItem.time + 1, count: {[getDomain(url)]: 1}}) :
                            requestControl.current[requestControl.current.length - 1].count[getDomain(url)] += 1
                    }
                }
                requestStatus.current.expect += 1
                new Promise(r => setTimeout(r, (requestControl.current[requestControl.current.length - 1].time - currentTime) * 1000)).then(res => findService(url, props.ids?.[index])).then(res => {
                    return res.getPosts(pn, refContainer.current.lastIDs?.[index])
                }).then(res => {
                    //TODO: show loading when fetching
                    requestStatus.current.get += 1
                    refContainer.current.notFetch[url] = true
                    tempResultPool.current[url] = [...tempResultPool.current[url] ? tempResultPool.current[url] : [], ...res]
                    if (requestStatus.current.expect === requestStatus.current.get) {
                        requestStatus.current = {expect: 0, get: 0}
                        let lastTime = Math.max(...Object.entries(tempResultPool.current).map(x => {
                            return new Date(x[1][x[1].length - 1].getTime())
                        }))
                        for (let item in tempResultPool.current) {
                            for (let i = 0; i < tempResultPool.current[item].length; i++) {
                                if (new Date(tempResultPool.current[item][i].getTime()) >= lastTime || !props.sort) {
                                    tempResultQueue.current.push(tempResultPool.current[item][i])
                                } else {
                                    tempResultPool.current[item] = tempResultPool.current[item].slice(i)
                                    break
                                }
                                if (i === tempResultPool.current[item].length - 1) {
                                    tempResultPool.current[item] = []
                                }
                            }
                            if (!tempResultPool.current[item].length) {
                                refContainer.current.notFetch[item] = false
                            }
                        }
                        tempResultQueue.current.length && dispatch({data: tempResultQueue.current, sort: props.sort, "blocklist":blocklist})
                        tempResultQueue.current = []
                    }
                    refContainer.current.hasMores[index] = res.hasMore() && res.length
                    refContainer.current.hasMores[index] && (refContainer.current.lastIDs[index] = res.getLastID())
                })
            }
        })
    }, [pn])
    return (
        <View style={{backgroundColor: getTheme().backgroundColor, height: "100%", flex: 1}}>
            <FlatList data={posts} renderItem={renderFunc(layoutMap, props)}
                      keyExtractor={(item, index) => {
                          return item.getIdentifyID()
                      }}
                      listKey={item=>item.getIdentifyID()}
                      onEndReached={() => {
                          setPn(pn + 1)
                      }}
                      removeClippedSubviews={true}
                      onEndReachedThreshold={0.1}
                      initialNumToRender={5}
                      getItemLayout={getItemLayout(layoutMap)}
                      maxToRenderPerBatch={props.urls.length*20}
                      windowSize={6}
                      bounces={false}
            />

        </View>
    )
}, (x, y) => x.url === y.url)