import React, {useEffect, useReducer, useRef, useState} from 'react';
import {HOT_FIRST, PREVIEW_POST} from "../constants";
import {findService} from "../findService";
import Post from "./post";
import {Dimensions, FlatList, Text, TouchableOpacity, View} from "react-native";
import ifWrapper from "../utils";
const reducer = (state, action) => {
    let result = [...state, ...action.data]
    if(action.sort)
        result = result.sort((a, b)=>a.getTime() < b.getTime())
    return result
}
const {height} = Dimensions.get('screen');
export const Posts = React.memo((props) => {
    const [pn, setPn] = useState(1)
    const refContainer = useRef({hasMores:[], lastIDs:[]})
    const [posts, dispatch] = useReducer(reducer, [])
    const [sortType, setSortType] = useState(HOT_FIRST)
    const [showLoadMore, setShowLoadMore] = useState(0);
    const requestControl = useRef([])
    const requestStatus = useRef({expect: 0, get: 0})
    const tempResultQueue = useRef([])

    useEffect(() => {
        for(const [index, url] of props.urls.entries()){
            let currentTime = Math.floor(Date.now()/1000)
            if(!requestControl.current.length){
                requestControl.current.push({time: currentTime, count: 1})
            }
            else{
                let lastItem = requestControl.current[requestControl.current.length -1]
                if(lastItem.time < currentTime){
                    requestControl.current = []
                    requestControl.current.push({time: currentTime, count: 1})
                }
                else{
                    lastItem.count >= 5?
                        requestControl.current.push({time: lastItem.time + 1, count: 1}):
                        requestControl.current[requestControl.current.length - 1].count += 1
                }
            }
            if(pn !== 1){
                if(!refContainer.current.hasMores[index]) continue
            }
            requestStatus.current.expect += 1
            new Promise(r => setTimeout(r, (requestControl.current[requestControl.current.length -1].time - currentTime) * 1000)).then(res=>findService(url)).then(res => {
                return res.getPosts(pn, refContainer.current.lastIDs?.[index])
            }).then(res => {

                //TODO: show loading when fetching
                requestStatus.current.get += 1
                tempResultQueue.current = [...tempResultQueue.current, ...res]
                if(requestStatus.current.expect === requestStatus.current.get){
                    requestStatus.current = {expect: 0, get: 0}
                    tempResultQueue.current.length && dispatch({data: tempResultQueue.current, sort: props.sort})
                    tempResultQueue.current = []
                }
                refContainer.current.hasMores[index] = res.hasMore()
                refContainer.current.hasMores[index] && (refContainer.current.lastIDs[index] = res.getLastID())
                !showLoadMore ^ !refContainer.current.hasMores.filter(x=>x).length && setShowLoadMore(refContainer.current.hasMores.filter(x=>x).length)
            })
        }

    }, [pn])

    function renderFunc (post) {
        return (<Post type={PREVIEW_POST} depth={0} url={post.item.url} data={post.item}
                      navigation={props.navigation}/>)
    }
    return (
        <View style={{ backgroundColor: "gray", height:"100%", flex:1}}>
            <FlatList data={posts} renderItem={renderFunc} 
                      keyExtractor={(item, index)=> {
                         return item.desc.dynamic_id_str
                      }}
                      onEndReached={()=> {
                          setPn(pn + 1)
                      }}
                      removeClippedSubviews={true}
                      onEndReachedThreshold={0.1}
                      initialNumToRender={5}
                      maxToRenderPerBatch={40}
                      windowSize={5}
                      bounces={false}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />

        </View>
    )
}, (x,y)=>x.url === y.url)