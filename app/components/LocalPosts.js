import React, {useEffect, useReducer, useRef, useState} from 'react';
import {deviceWidth, PREVIEW_POST} from "../constants";
import {FlatList, View} from "react-native";
import Post from "./post";

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

    const renderFunc = (post) => {
        return (
            <Post id={"defaultPost"} parentID={post.item.parentID} parentType={post.item.parentType}
                  type={PREVIEW_POST} depth={0} url={post.item.url} data={post.item}
                  onLayout={e => {
                      if (e.nativeEvent.layout.width !== deviceWidth) return
                      let tempID = post.item.identifyID
                      let item = layoutMap.current.get(tempID)
                      if (!item || (item && item.height < e.nativeEvent.layout.height)) {
                          let offsetValue = 0
                          for (let i of layoutMap.current) {
                              if (i[0] === tempID) break
                              offsetValue += i[1].height
                          }
                          layoutMap.current.set(tempID, {height: e.nativeEvent.layout.height, offset: offsetValue})
                      }
                  }}
                  height={layoutMap.current.get(post.item.identifyID)?.height > 121 ? layoutMap.current.get(post.item.identifyID)?.height : undefined}
                  navigation={props.navigation}/>)
    }
    return (
        <View style={{flex: 1}}>
            <FlatList data={users} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                      keyExtractor={(item) => item.identifyID}
                      extraData={randomID}
                      removeClippedSubviews={true}
                      initialNumToRender={5}
                      getItemLayout={(data, index) => {
                          let item = layoutMap.current.get(data[index].identifyID)
                          if (!item) return undefined
                          return {length: item.height, offset: item.offset, index}
                      }}
                      maxToRenderPerBatch={40}
                      windowSize={6}
                      bounces={false}
            />
        </View>
    )
}