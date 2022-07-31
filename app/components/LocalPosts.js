import React, {useEffect, useReducer, useRef, useState} from 'react';
import {PREVIEW_POST} from "../constants";
import {FlatList, Text, View} from "react-native";
import Post from "./post";

export const LocalPosts = (props) => {
    const reducer = (state, action) => {
        if (action.type === "replace") {
            doUpdate(Math.random() * 1000)
            return [...action.data]
        }
        return [...state, ...action.data]
    }
    const [pn, setPn] = useState(1)
    const [randomID, doUpdate] = useState(0)
    const [users, dispatch] = useReducer(reducer, [])
    const refContainer = useRef({})

    useEffect(() => {
        props.data && dispatch({data: props.data, type: "replace"})
    }, [props.randomID])

    const renderFunc = (post) => {
        return (
            <Post id={"defaultPost"} parentID={post.item.parentID} parentType={post.item.parentType} type={PREVIEW_POST}
                  depth={0} url={post.item.url} data={post.item} navigation={props.navigation}/>)
    }
    return (
        <View style={{flex: 1}}>
            <FlatList data={users} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                      keyExtractor={(item, index) => item.identifyID}
                      onEndReached={() => {
                          refContainer.current.hasMore && setPn(pn + 1)
                      }}
                      extraData={randomID}
                      onEndReachedThreshold={0.1}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />
        </View>
    )
}