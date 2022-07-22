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


const Feed = (props) => (
    <View style={{flex: 1, backgroundColor: '#ff4081'}}>
        <Post type={{PREVIEW_POST}} navigation={props.navigation} depth={0}
              url={"https://t.bilibili.com/683447829539061785?spm_id_from=333.999.0.0"}/>
        <FlatList data={[1, 2, 3, 4]} renderItem={({item}) => <Text>{item}</Text>}>
        </FlatList>
        <Button title={"test1"} onPress={() => alert("test")}/>
    </View>
);

const Subscription = () => (
    <View style={{flex: 1, backgroundColor: '#ececec'}}>
        {/*<FullPost url={"https://t.bilibili.com/683540957314941016"}/>*/}
    </View>
);

const Trending = () => (
    <View style={{flex: 1, backgroundColor: "#FFFFFF"}}>
    </View>
);
const Bookmark = () => (
    <View style={{flex: 1, backgroundColor: "#FFFFFF"}}/>
);

const renderTabBar = props => (
    <View style={{paddingBottom: 3, overflow: "hidden"}}>
        <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'white'}}
            style={{backgroundColor: '#c9d8c5', elevation: 0}}
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
                return (<Feed navigation={navigation}/>)
            case "Subscription":
                return (<Subscription navigation={navigation}/>)
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
        <View style={{flex: 1}}>
            {/*<Text>*/}
            {/*    test*/}
            {/*  /!*</Text>*!/*/}
            {/*<View style={{height: 50, alignItems: 'center', backgroundColor: "#c9d8c5", flexDirection: 'row'}}>*/}
            {/*    <View style={{flexDirection: "row",marginLeft:10,marginTop:5, flex:1}}>*/}
            {/*        <Text style={{fontSize: 20, marginLeft: 0.03 * layout.width}}>{routes[index]['key']}</Text>*/}
            {/*    </View>*/}
            {/*    <View style={{flexDirection: "row", marginTop:0}}>*/}
            {/*        <FontAwesome name={"search"} size={20} style={{marginRight:20}}/>*/}
            {/*    </View>*/}
            {/*</View>*/}
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
        </View>
    );
};

export default Index;