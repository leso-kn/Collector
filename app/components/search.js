import SearchBar from '@nghinv/react-native-search-bar';
import React, {useCallback, useEffect, useReducer, useRef, useState} from 'react';
import {Text, View, StyleSheet, FlatList, useWindowDimensions, Image} from "react-native";
import ifWrapper, {reducer} from "../utils";
import {TabBar, TabView} from "react-native-tab-view";
import {findService, getTheme} from "../findService";
import {deviceWidth, HOT_FIRST, PREVIEW_POST} from "../constants";
import {postPageUrl, searchApiUrl} from "../services/bilispace/BiliSpaceLinks";
import Post from "./post";
import {ChannelInfo} from "./ChannelInfo";
import {Channels} from "./Channels";

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
                    textInputStyle={{marginTop: 2.5, marginLeft: 3}}
                    value={text}
                    onChangeText={onChangeText}
                    onSubmitEditing={() => {
                        setSearchWord(text)
                    }}
                />
            </View>
        )
    }
    const SearchResult = (props) => {
        const [data, dispatch] = useReducer(reducer, {})
        const layout = useWindowDimensions();

        const [index, setIndex] = React.useState(0);
        const [routes] = React.useState([
            {key: 'users', title: "Channels"},
        ]);

        const renderTabBar = props => (
            <TabBar
                {...props}
                indicatorStyle={{backgroundColor: 'white'}}
                style={{height: 40}}
                labelStyle={{fontSize: 13, marginTop: -8, marginBottom: 0}}
            />
        );
        const renderScene = ({route}) => {
            switch (route.key) {
                case 'users':
                    return <Channels url={searchApiUrl + `${searchWord}&page=0`} navigation={props.navigation}/>
                default:
                    return null;
            }
        };

        return (
            <View style={{flex: 1}}>
                {ifWrapper(searchWord, (
                    <TabView
                        renderTabBar={renderTabBar}
                        navigationState={{index, routes}}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{width: layout.width}}
                    />
                ))}

            </View>

        )
    }
    useEffect(() => navigation.setOptions({headerTitle: SearchInside}), [])
    return (
        <FlatList data={[1]}
                  renderItem={(prop) => <SearchResult navigation={navigation}/>}/>

    )
}