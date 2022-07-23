import React, {useEffect, useReducer, useRef, useState} from 'react';
import {HOT_FIRST} from "../constants";
import {findService} from "../findService";
import {ChannelInfo} from "./ChannelInfo";
import {FlatList, Text, View} from "react-native";

export const Channels = React.memo((props) => {
    const reducer = (state, action) => {
        return [...state, ...action.data]
    }
    const [pn, setPn] = useState(1)
    const [users, dispatch] = useReducer(reducer, [])
    const refContainer = useRef({})
    useEffect(() => {
        !props.data && findService(props.url).then(res=> {
            return res.getResults(pn)
        }).then(res => {
            res.length && dispatch({data: res})
            refContainer.current.hasMore = res.hasMore()
        })
    }, [pn])

    useEffect(()=>{
       props.data && dispatch({data:props.data})
    },[])

    const renderFunc = (user) => {
        return (<ChannelInfo data={user.item} navigation={props.navigation}/>)
    }
    return (
        <View style={{flex: 1}}>
            <FlatList data={users} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                      onEndReached={() => {
                          refContainer.current.hasMore && setPn(pn + 1)
                      }}
                      onEndReachedThreshold={0.1}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />
        </View>
    )
})