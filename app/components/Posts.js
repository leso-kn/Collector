import React, {useEffect, useReducer, useRef, useState} from 'react';
import {HOT_FIRST, PREVIEW_POST} from "../constants";
import {findService} from "../findService";
import Post from "./post";
import {Dimensions, FlatList, View} from "react-native";

const reducer = (state, action) => {
    let result = [...state]
    for (let item of action.data) {
        if (result.map(x => x.getIdentifyID()).includes(item.getIdentifyID())) continue
        result.push(item)
    }
    if (action.sort)
        result = result.sort((a, b) => a.getTime() < b.getTime())
    return result
}
const {width} = Dimensions.get('screen');
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
        for (const [index, url] of props.urls.entries()) {
            if (refContainer.current.notFetch[url]) continue
            if (pn !== 1) {
                if (!refContainer.current.hasMores[index]) continue
            }
            let currentTime = Math.floor(Date.now() / 1000)
            if (!requestControl.current.length) {
                requestControl.current.push({time: currentTime, count: 1})
            } else {
                let lastItem = requestControl.current[requestControl.current.length - 1]
                if (lastItem.time < currentTime) {
                    requestControl.current = []
                    requestControl.current.push({time: currentTime, count: 1})
                } else {
                    lastItem.count >= 5 ?
                        requestControl.current.push({time: lastItem.time + 1, count: 1}) :
                        requestControl.current[requestControl.current.length - 1].count += 1
                }
            }
            requestStatus.current.expect += 1
            new Promise(r => setTimeout(r, (requestControl.current[requestControl.current.length - 1].time - currentTime) * 1000)).then(res => findService(url)).then(res => {
                return res.getPosts(pn, refContainer.current.lastIDs?.[index])
            }).then(res => {
                //TODO: show loading when fetching
                requestStatus.current.get += 1
                refContainer.current.notFetch[url] = true
                tempResultPool.current[url] = [...tempResultPool.current[url] ? tempResultPool.current[url] : [], ...res]
                if (requestStatus.current.expect === requestStatus.current.get) {
                    requestStatus.current = {expect: 0, get: 0}
                    let lastTime = Math.max(...Object.entries(tempResultPool.current).map(x => {
                        return x[1][x[1].length - 1].getTime()
                    }))
                    for (let item in tempResultPool.current) {
                        for (let i = 0; i < tempResultPool.current[item].length; i++) {
                            if (tempResultPool.current[item][i].getTime() >= lastTime) {
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
                    tempResultQueue.current.length && dispatch({data: tempResultQueue.current, sort: props.sort})
                    tempResultQueue.current = []
                }
                refContainer.current.hasMores[index] = res.hasMore()
                refContainer.current.hasMores[index] && (refContainer.current.lastIDs[index] = res.getLastID())
            })
        }

    }, [pn])

    function renderFunc(post) {
        return (
            <Post type={PREVIEW_POST} depth={0} onLayout={e=>{
                if(e.nativeEvent.layout.width !== width)return
                let tempID = post.item.getIdentifyID()
                let item = layoutMap.current.get(tempID)
                if(!item || (item && item.height < e.nativeEvent.layout.height)){
                    let offsetValue = 0
                    for(let i of layoutMap.current){
                        if(i[0] === tempID)break
                        offsetValue += i[1].height+0.4
                    }
                    layoutMap.current.set(tempID, {height: e.nativeEvent.layout.height, offset:offsetValue})
                }
            }
            } url={post.item.url} data={post.item} height={layoutMap.current.get(post.item.getIdentifyID())?.height > 121?layoutMap.current.get(post.item.getIdentifyID())?.height : undefined}
                  navigation={props.navigation}/>)
    }

    return (
        <View style={{backgroundColor: "#ececec", height: "100%", flex: 1}}>
            <FlatList data={posts} renderItem={renderFunc}
                      keyExtractor={(item, index) => {
                          return item.getIdentifyID()
                      }}
                      onEndReached={() => {
                          setPn(pn + 1)
                      }}
                      removeClippedSubviews={true}
                      onEndReachedThreshold={0.1}
                      initialNumToRender={5}
                      getItemLayout={(data, index)=>{
                          let item = layoutMap.current.get(data[index].getIdentifyID())
                          if(!item)return undefined
                          return {length: item.height, offset: item.offset, index}
                      }}
                      maxToRenderPerBatch={40}
                      windowSize={6}
                      bounces={false}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />

        </View>
    )
}, (x, y) => x.url === y.url)