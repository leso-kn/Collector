import React, {useEffect} from 'react';
import {
    TouchableNativeFeedback, TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {TabView, TabBar} from 'react-native-tab-view';
import {Feeds} from "./components/Feeds";
import {Subscriptions} from "./components/Subscriptions";
import SafeAreaViewPlus from "react-native-zy-safe-area-plus";
import {Bookmarks} from "./components/Bookmarks";
import {getTheme} from "./utils";
import RNRestart from "react-native-restart";

const renderTabBar = props => (
    <View style={{paddingBottom: 3, overflow: "hidden"}}>
        <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'white'}}
            style={{backgroundColor: getTheme().color, elevation: 0}}
            renderIcon={({route, focused, color}) => {
                switch (route.key) {
                    case "Feed":
                        return (<FontAwesome name={"feed"} size={20}/>)
                    case "Subscription":
                        return (<FontAwesome5 name={"user-friends"} size={20}/>)
                    case "Bookmark":
                        return (<FontAwesome name={"bookmark"} size={20}/>)
                }
            }}
        />
    </View>
);

const Index = ({navigation}) => {
    useEffect(()=>{
        navigation.setOptions({
            headerRight: HeaderRightElement,
            title:"Feed"
        })
    },[])
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [randomID, doUpdate] = React.useState(0)
    const [routes] = React.useState([
        {key: 'Feed'},
        {key: 'Subscription'},
        {key: 'Bookmark'}
    ]);
    const renderScene = ({route}) => {
        switch (route.key) {
            case "Feed":
                return (<Feeds navigation={navigation} randomID={randomID}/>)
            case "Subscription":
                return (<Subscriptions navigation={navigation} randomID={randomID}/>)
            case "Bookmark":
                return (<Bookmarks navigation={navigation} randomID={randomID}/>)
        }
    };
    const SearchButton = () => {
        return (
            <View>
                <TouchableNativeFeedback onPress={() => navigation.push("Search")}>
                    <FontAwesome name={"search"} size={20}/>
                </TouchableNativeFeedback>
            </View>
        )
    }
    //only work in production
    const RefreshButton = () => {
        return (
            <View style={{marginRight: 30}}>
                <TouchableOpacity onPress={()=>RNRestart.Restart()}>
                    <FontAwesome name={"refresh"} size={20}/>
                </TouchableOpacity>
            </View>
        )
    }
    const HeaderRightElement = () => {
        return (<View style={{flexDirection: "row", marginRight:20}}>
            <RefreshButton/>
            <SearchButton/>
        </View>)
    }

    return (
        <SafeAreaViewPlus style={{flex: 1}} barStyle={getTheme().isDarkTheme?null:undefined}>
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={(i) => {
                    setIndex(i)
                    navigation.setOptions({title: routes[i].key})
                }}
                initialLayout={{width: layout.width}}
            />
        </SafeAreaViewPlus>
    );
};

export default Index;