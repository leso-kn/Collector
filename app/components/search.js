import SearchBar from '@nghinv/react-native-search-bar';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text} from "react-native";
import {TabBar, TabView} from "react-native-tab-view";
import {Channels} from "./Channels";
import {deviceWidth} from "../constants";
import {Posts} from "./Posts";
import {getCurrentServiceUrls, getTheme} from "../utils";

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
                    isDarkTheme={getTheme().isDarkTheme}
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
        const [serviceUrls, setServiceUrls] = useState()
        useEffect(()=>{
            getCurrentServiceUrls().then(res=>setServiceUrls(res))
        },[])
        const renderTabBar = props => (
            <TabBar
                {...props}
                indicatorStyle={{backgroundColor: 'white'}}
                style={{height: 40, backgroundColor: getTheme().tabBarColor}}
                labelStyle={{fontSize: 13, marginTop: -8, marginBottom: 0}}
            />
        );
        const renderScene = ({route}) => {
            switch (route.key) {
                case 'users':
                    return serviceUrls?<Channels url={serviceUrls.getSearchChannelUrl(searchWord)}
                                     navigation={props.navigation}/>:null
                case "posts":
                    let parsedSearchWord = searchWord.split("@")
                    if(parsedSearchWord.length === 1){
                        parsedSearchWord = ["", parsedSearchWord[0]]
                    }
                    return serviceUrls?<Posts navigation={props.navigation}
                                  urls={[serviceUrls.getSearchPostUrl(parsedSearchWord[0], parsedSearchWord[1])]}/>:null
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
                    <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>
                        <Text style={{textAlign: "center"}}>
                            {'To search contents inside a channel, input \n\n[ID]@[search word]' +
                                "\n\ne.g. 12345678@open source" +
                                '\n\n This query will search "open source" in a channel whose ID is 12345678' +
                                "\n\nAlternatively, you can input[Channel Name]@[search word]" +
                                '\n\ne.g. Arch Linux@open source' +
                                '\n\nThis query will search "open source" in the channel "Arch Linux"' +
                                "\n\n\nNote:\nBoth or neither or one of these ways work, depending on the service." +
                                "\n\nSome service only support one of them, so that the other is implemented by doing pre-search to convert one to the other." +
                                " In this case, the first value of the pre-search is used."
                            }
                        </Text>
                    </View>
                )}
            </View>
        )
    }
    useEffect(() => navigation.setOptions({headerTitle: SearchInside}), [])
    return (
        <SearchResult navigation={navigation}/>
    )
}