import SearchBar from '@nghinv/react-native-search-bar';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text} from "react-native";
import {TabBar, TabView} from "react-native-tab-view";
import {searchApiUrl} from "../services/bilispace/BiliSpaceLinks";
import {Channels} from "./Channels";
import {deviceWidth} from "../constants";

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
        const [index, setIndex] = React.useState(0);
        const [routes] = React.useState([
            {key: 'users', title: "Channels"},
            {key: "posts", title: "Posts"}
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
                    return <View/>
            }
        };

        return (
            <View style={{flex: 1}}>
                {searchWord ? (
                    <TabView
                        renderTabBar={renderTabBar}
                        navigationState={{index, routes}}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{width: deviceWidth}}
                    />
                ) : (
                    <View style={{ justifyContent:"center", alignItems:"center", marginTop:20}}>
                        <Text style={{textAlign:"center"}}>
                            {'To search contents inside a channel, input \n\n[My channel name]@[search word]' +
                            '\n\n e.g. Arch Linux@open source' +
                            '\n\n This query will search "open source" in channel "Arch Linux"'}
                        </Text>
                    </View>
                )}
            </View>
        )
    }
    useEffect(() => navigation.setOptions({headerTitle: SearchInside}), [])
    return (
        <FlatList data={[1]}
                  renderItem={(prop) => <SearchResult navigation={navigation}/>}/>

    )
}