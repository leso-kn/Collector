import React, {useEffect, useReducer, useRef, useState} from 'react';
import {HOT_FIRST, PREVIEW_POST} from "../constants";
import {findService} from "../findService";
import Post from "./post";
import {FlatList, View} from "react-native";

export const Posts = React.memo((props) => {
    const reducer = (state, action) => {
        return [...state, ...action.data]
    }
    const [pn, setPn] = useState(1)
    const refContainer = useRef({})
    const [posts, dispatch] = useReducer(reducer, [])
    const [sortType, setSortType] = useState(HOT_FIRST)
    useEffect(() => {
        refContainer && findService(props.url).then(res => {

            refContainer.current.postPageUrl = res.getPostPageUrl()
            refContainer.current.targetUrlProperty = res.getTargetUrlProperty()
            return res.getPosts(pn, refContainer.current.lastID)
        }).then(res => {
            //TODO: show loading when fetching
            res.length && dispatch({data: res})
            refContainer.current.hasMore = res.hasMore()
            refContainer.current.hasMore && (refContainer.current.lastID = res.getLastID())
        })
    }, [pn])

    const renderFunc = (post) => {
        return (<Post type={PREVIEW_POST} depth={0} url={refContainer.current.postPageUrl + eval(refContainer.current.targetUrlProperty)}
                      navigation={props.navigation}/>)
    }
    return (
        <View style={{flex: 1, backgroundColor: "gray"}}>
            <FlatList data={posts} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                      onEndReached={() => refContainer.current.hasMore && setPn(pn + 1)}
                      onEndReachedThreshold={0.1}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />
        </View>
    )
})