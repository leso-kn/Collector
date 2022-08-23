import React, {useEffect, useReducer, useRef, useState} from 'react';
import {findService} from "../findService";
import {ChannelInfo} from "./ChannelInfo";
import {FlatList, View} from "react-native";
import {getTheme} from "../utils";

const renderFunc = props=>(user) => {
    return (<ChannelInfo data={user.item} navigation={props.navigation}/>)
}

export const Channels = (props) => {
    const reducer = (state, action) => {
        if(action.type === "replace"){
            doUpdate(Math.random()*1000)
            return [...action.data]
        }
        return [...state, ...action.data]
    }
    const [pn, setPn] = useState(1)
    const [randomID, doUpdate] = useState(0)
    const [users, dispatch] = useReducer(reducer, [])
    const refContainer = useRef({})
    useEffect(() => {
        !props.data && findService(props.url).then(res=> {
            return res.getChannels(pn, refContainer.current.lastID)
        }).then(res => {
            res?.length && dispatch({data: res})
            refContainer.current.hasMore = res.hasMore()
            refContainer.current.lastID = res.getLastID()
        })
    }, [pn])

    useEffect(()=>{
       props.data && dispatch({data:props.data, type:"replace"})
    },[props.randomID])

    return (
        <View style={{flex: 1, backgroundColor:getTheme().backgroundColor}}>
            <FlatList data={users} renderItem={renderFunc(props)}
                      keyExtractor={item=>item.identifyID}
                      listKey={item=>item.identifyID}
                      onEndReached={() => {
                          refContainer.current.hasMore && setPn(pn + 1)
                      }}
                      extraData={randomID}
                      onEndReachedThreshold={0.1}
            />
        </View>
    )
}