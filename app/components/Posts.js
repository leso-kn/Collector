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

    useEffect(() => {
        for(const [index, url] of props.urls.entries()){
            if(pn !== 1){
                if(!refContainer.current.hasMores[index]) continue
            }
            findService(url).then(res => {
                return res.getPosts(pn, refContainer.current.lastIDs?.[index])
            }).then(res => {
                //TODO: show loading when fetching
                res.length && dispatch({data: res, sort:props.sort})
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
            <FlatList data={posts} renderItem={renderFunc} ListFooterComponent={showLoadMore?<View style={{
                borderStyle: "solid",
                borderLeftWidth: 0,
                marginBottom: 0,
                marginTop: -5,
                height: 50,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <TouchableOpacity onPress={() => {
                    showLoadMore && setPn(pn + 1)
                }}>
                    <Text style={{color: "black"}}>
                        {/*TODO:multi-language*/}
                        Load More
                    </Text>
                </TouchableOpacity>
            </View>:<View style={{height:50}}/> }
                      keyExtractor={(item, index)=> {
                         return item.desc.dynamic_id_str
                      }}
                      initialNumToRender={12}
                      maxToRenderPerBatch={40}
                      bounces={false}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />

        </View>
    )
}, (x,y)=>x.url === y.url)