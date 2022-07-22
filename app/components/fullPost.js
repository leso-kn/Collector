import Post from "./post";
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, ScrollView, Text, View} from "react-native";
import {FIRST_POST, HOT_FIRST, OLD_FIRST, OTHER_POST} from "../constants";
import {findService} from "../findService";
import {Picker} from '@react-native-picker/picker';

const FullPost = (packedProps) => {
    let props = packedProps.route.params

    const reducer = (state, action) => {
        return [...state, ...action.data]
    }
    const [pn, setPn] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [comments, dispatch] = useReducer(reducer, [])
    const [sortType, setSortType] = useState(HOT_FIRST)
    const parentID = useRef(null);

    useEffect(() => {
        findService(props.url).then(res => {
            parentID.current = res.getID()
            return res.getComments(pn)
        }).then(res => {
            //TODO: show loading when fetching
            res?.data?.data?.replies?.length && dispatch({data: res.data.data.replies})
            setHasMore(res?.data?.data?.replies?.length === 20)
        })
    }, [pn])
    const head = (
        <View>
            <View style={{marginTop: 5, marginBottom: 10, borderBottomColor: "gray", borderBottomWidth: 0.3}}>
                <Post type={FIRST_POST} depth={0} url={props.url} navigation={packedProps.navigation} />
            </View>
        </View>
    )
    const renderFunc = (comment) => {
        return (<Post navigation={packedProps.navigation} data={comment.item} parentID={parentID.current} type={OTHER_POST} depth={0} url={"biliComment"}/>)
    }
    return (
        <FlatList data={comments} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                  ListHeaderComponent={head}
                  ListEmptyComponent={<View/>}
                  onEndReached={() => hasMore && setPn(pn + 1)}
                  onEndReachedThreshold={0.5}
                  ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
        />
    )
}
export default FullPost;