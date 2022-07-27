import React, {useEffect} from 'react';
import {
    Button, Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TouchableNativeFeedback, TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View,
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Post from "./components/post";
import FullPost from "./components/fullPost";
import Channel from "./components/channel";
import {PREVIEW_POST} from "./constants";
import {Feeds} from "./components/Feeds";
import {Subscriptions} from "./components/Subscriptions";
import SafeAreaViewPlus from "react-native-zy-safe-area-plus";
import {Bookmarks} from "./components/Bookmarks";
import {getTheme} from "./utils";

const Bookmark = () => (
    <View style={{flex: 1, backgroundColor: "#FFFFFF"}}/>
);

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
    const RefreshButton = () => {
        return (
            <View style={{marginRight: 30}}>
                <TouchableOpacity onPress={() => doUpdate(Math.random()*1000)}>
                    <FontAwesome name={"refresh"} size={20}/>
                </TouchableOpacity>
            </View>
        )
    }
    const HeaderRightElement = () => {
        return (<View style={{flexDirection: "row"}}>
            <RefreshButton/>
            <SearchButton/>
        </View>)
    }

    return (
        <SafeAreaViewPlus style={{flex: 1}}>
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