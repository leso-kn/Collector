import Post from "./post";
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {FlatList, View} from "react-native";
import {deviceWidth, FIRST_POST, HOT_FIRST, OLD_FIRST, OTHER_POST} from "../constants";
import {findService} from "../findService";

const FullPost = (packedProps) => {
    let props = packedProps.route.params
    const parentRef = useRef({IDList: []});
    const reducer = (state, action) => {
        // console.log(JSON.stringify(state.map(x=>x.member.uname+" " +x.content.message)) + "state"+ state.length)
        // console.log(JSON.stringify(action.data.map(x=>x.member.uname+" " +x.content.message)) + "action" + action.data.length)
        let result = [...state]
        for(let item of action.data){
           if(result.map(x=>x.getIdentifyID()).includes(item.getIdentifyID())) continue
            result.push(item)
        }
        return result
    }
    const [pn, setPn] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [comments, dispatch] = useReducer(reducer, [])
    const [sortType, setSortType] = useState(HOT_FIRST)
    const [randomID, doUpdate] = useState(0)
    const layoutMap = useRef(new Map())

    useEffect(() => {
        if(props.parentID){
            findService(props.url, props.id, props.data)
                .then(res => res.getReplies(pn, props.parentID, props.parentType)).then((res) => {
                res?.length && dispatch({data: res})
                setHasMore(res.hasMore())
            })
        }
        else{
            findService(props.url, props.id, props.data).then(res => {
                parentRef.current.parentID = res.getID()
                parentRef.current.parentType = res.getType()
                return res.getComments(pn)
            }).then(res => {
                //TODO: show loading when fetching
                //  alert(JSON.stringify(res.data.data.replies))
                res?.length && dispatch({data: res})
                setHasMore(res.hasMore())
            })
        }


    }, [pn])
    const head = (
        <View>
            <View style={{marginTop: 5, marginBottom: 10, borderBottomColor: "gray", borderBottomWidth: 0.3}}>
                <Post type={FIRST_POST} data={props.data} depth={0} url={props.url} id={props.id}
                      navigation={packedProps.navigation}/>
            </View>
        </View>
    )
    const renderFunc = (comment) => {
        return (<Post navigation={packedProps.navigation} onLayout={e => {
            if (e.nativeEvent.layout.width !== deviceWidth) return
            let tempID = comment.item.getIdentifyID()
            let item = layoutMap.current.get(tempID)
            if (!item || (item && item.height < e.nativeEvent.layout.height)) {
                let offsetValue = 0
                for (let i of layoutMap.current) {
                    if (i[0] === tempID) break
                    offsetValue += i[1].height + 0.4
                }
                layoutMap.current.set(tempID, {height: e.nativeEvent.layout.height, offset: offsetValue})
            }
        }} data={comment.item} parentType={parentRef.current.parentType} parentID={parentRef.current.parentID}
                      height={layoutMap.current.get(comment.item.getIdentifyID())?.height > 121?layoutMap.current.get(comment.item.getIdentifyID())?.height : undefined}
                      type={OTHER_POST} depth={0} url={"biliComment"}/>)
    }

    return (
        <FlatList data={comments} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                  ListHeaderComponent={head}
                  ListEmptyComponent={<View/>}
                  extraData={randomID}
                  keyExtractor={x => x.getIdentifyID()}
                  onEndReached={() => {
                      hasMore && setPn(pn + 1)
                  }}
                  onEndReachedThreshold={0.1}
                  getItemLayout={(data, index)=>{
                      let item = layoutMap.current.get(data[index].getIdentifyID())
                      if(!item)return undefined
                      return {length: item.height, offset: item.offset, index}
                  }}
                  maxToRenderPerBatch={50}
                  windowSize={8}
                  initialNumToRender={8}
                  bounces={false}
                  ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
        />
    )
}
export default FullPost;