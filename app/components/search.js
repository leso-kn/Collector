import SearchBar from '@nghinv/react-native-search-bar';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Text, View, StyleSheet, FlatList, useWindowDimensions, Image} from "react-native";
import ifWrapper, {reducer} from "../utils";
import {TabBar, TabView} from "react-native-tab-view";
import {findService} from "../findService";
import {deviceWidth, HOT_FIRST, PREVIEW_POST} from "../constants";
import {postPageUrl, searchApiUrl} from "../services/bilispace/BiliSpaceLinks";
import Post from "./post";
import {ChannelInfo} from "./ChannelInfo";

const Users = React.memo((props) => {
    const reducer = (state, action) => {
        return [...state, ...action.data]
    }
    const [pn, setPn] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [users, dispatch] = useReducer(reducer, [])
    const [sortType, setSortType] = useState(HOT_FIRST)
    useEffect(() => {
        !props.url.includes("keyword=&") && findService(props.url.replace(`page=0`, `page=${pn}`)).then(res => {
            res.getResults().length && dispatch({data: res.getResults()})
            setHasMore(res.getHasMore())
        })
    }, [pn])

    const renderFunc = (user) => {
        return (<ChannelInfo data={user} url={"biliUserInfo"} navigation={props.navigation}/>)
    }
    return (
        <View style={{flex: 1}}>
            <FlatList data={users} renderItem={renderFunc} ListFooterComponent={(<View style={{height: 50}}/>)}
                      onEndReached={() => {
                          hasMore && setPn(pn + 1)
                      }}
                      onEndReachedThreshold={0.1}
                      ItemSeparatorComponent={() => (<View style={{backgroundColor: "#dad7d7", height: 0.4}}/>)}
            />
        </View>
    )
})

export const Search = ({navigation}) => {
    const [searchWord, setSearchWord] = useState("")
    const SearchInside = () => {
        const [text, setText] = useState('');
        const onChangeText = useCallback((value) => {
            setText(value);
        }, []);
        const styles = StyleSheet.create({
            container: {
                flex: 1
            },
            textInput: {
                marginLeft: -10,
                paddingVertical: 8
            },
        });
        return (
            <View style={styles.container}>
                <SearchBar
                    borderRadius={0}
                    placeholder='Search'
                    width={"80%"}
                    containerStyle={styles.textInput}
                    textInputStyle={{marginTop:2.5, marginLeft: 3}}
                    value={text}
                    onChangeText={onChangeText}
                    onSubmitEditing={()=>{setSearchWord(text)}}
                />
            </View>
        )
    }
    const SearchResult = (props) => {
        const [data, dispatch] = useReducer(reducer, {})
        const layout = useWindowDimensions();

        const [index, setIndex] = React.useState(0);
        const [routes] = React.useState([
            {key: 'users', title: "Users"},
        ]);

        const renderTabBar = props => (
            <TabBar
                {...props}
                indicatorStyle={{backgroundColor: 'white'}}
                style={{backgroundColor: '#c9d8c5', height: 40}}
                labelStyle={{fontSize: 13, marginTop: -8, marginBottom: 0}}
            />
        );
        const renderScene = ({route}) => {
            switch (route.key) {
                case 'users':
                    return <Users url={searchApiUrl + `${searchWord}&page=0`} navigation={props.navigation}/>
                default:
                    return null;
            }
        };

        return (
            <View style={{flex: 1}}>

                <TabView
                    renderTabBar={renderTabBar}
                    navigationState={{index, routes}}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{width: layout.width}}
                />
            </View>

        )
    }
    useEffect(()=> navigation.setOptions({headerTitle: SearchInside}),[])
    return (
        <FlatList data={[1]}
                  renderItem={(prop) =><SearchResult navigation={navigation} />}/>

    )
}