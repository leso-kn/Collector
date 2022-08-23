import React, {useEffect, useReducer, useRef, useState} from 'react';
import {PREVIEW_POST} from "../constants";
import {FlatList, View} from "react-native";
import Post from "./post";
import {getItemLayout, onLayout} from "./renderPost";

function renderFunc(layoutMap, props) {
    return (post)=>{
        return (
            <Post id={"defaultPost"} parentID={post.item.parentID} parentType={post.item.parentType}
                  type={PREVIEW_POST} depth={0} url={post.item.url} data={post.item}
                  onLayout={onLayout(post, layoutMap, true)}
                  height={layoutMap.current.get(post.item.identifyID)?.height > 121 ? layoutMap.current.get(post.item.identifyID)?.height : undefined}
                  navigation={props.navigation}/>)
    }
}

export const LocalPosts = (props) => {
    const reducer = (state, action) => {
        if (action.type === "replace") {
            doUpdate(Math.random() * 1000)
            return [...action.data]
        }
        return [...state, ...action.data]
    }
    const [randomID, doUpdate] = useState(0)
    const [users, dispatch] = useReducer(reducer, [])
    const layoutMap = useRef(new Map())

    useEffect(() => {
        props.data && dispatch({data: props.data, type: "replace"})
    }, [props.randomID])

    return (
        <View style={{flex: 1}}>
            <FlatList data={users} renderItem={renderFunc(layoutMap, props)} ListFooterComponent={(<View style={{height: 50}}/>)}
                      keyExtractor={(item) => item.identifyID}
                      extraData={randomID}
                      removeClippedSubviews={true}
                      initialNumToRender={5}
                      getItemLayout={getItemLayout(layoutMap, true)}
                      maxToRenderPerBatch={40}
                      windowSize={6}
                      bounces={false}
            />
        </View>
    )
}