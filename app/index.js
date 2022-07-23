import React from 'react';
import {
    Button, Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TouchableNativeFeedback,
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
import {Trending} from "./components/Trending";
import {getTheme} from "./findService";
import {Subscriptions} from "./components/Subscriptions";
import SafeAreaViewPlus from "react-native-zy-safe-area-plus";

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
                    case "Trending":
                        return (<MaterialIcons name={"whatshot"} size={22}/>)
                    case "Bookmark":
                        return (<FontAwesome name={"bookmark"} size={20}/>)
                }
            }}
        />
    </View>
);

const Index = ({navigation}) => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'Feed'},
        {key: 'Subscription'},
        {key: 'Trending'},
        {key: 'Bookmark'}
    ]);
    const renderScene = ({route}) => {
        switch (route.key) {
            case "Feed":
                return (<Feeds navigation={navigation}/>)
            case "Subscription":
                return (<Subscriptions navigation={navigation}/>)
            case "Trending":
                return (<Trending navigation={navigation}/>)
            case "Bookmark":
                return (<Bookmark navigation={navigation}/>)
        }
    };
    const SearchButton = () => {
        return (
            <TouchableNativeFeedback onPress={()=>navigation.push("Search")}>
                <FontAwesome name={"search"} size={20}/>
            </TouchableNativeFeedback>
        )
    }
    navigation.setOptions({headerRight: SearchButton})
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