import React from 'react';
import {
    Button, Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    useWindowDimensions,
    View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Post from "./components/post";
import FullPost from "./components/fullPost";
import Channel from "./components/channel";


const Feed = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} >
        <Post isFirstPost={true} depth={0} url={"https://t.bilibili.com/683447829539061785?spm_id_from=333.999.0.0"}/>
        <FlatList data={[1, 2, 3, 4]} renderItem={({item}) => <Text>{item}</Text>}>
        </FlatList>
        <Button title={"test1"} onPress={()=>alert("test")}/>
    </View>
  );
  
const Subscription = () => (
<View style={{ flex: 1, backgroundColor: '#ececec' }} >
    <FullPost url={"https://t.bilibili.com/683540957314941016"}/>
</View>
);

const Trending = ()=>(
  <View style={{flex: 1, backgroundColor:"#FFFFFF"}}>
      <Channel url={"https://space.bilibili.com/672328094/dynamic"}
      />
  </View>
);
const Bookmark = ()=>(
  <View style={{flex: 1, backgroundColor:"#FFFFFF"}}/>
);

const renderScene = SceneMap({
    feed: Feed,
    subscription: Subscription,
    trending: Trending,
    bookmark: Bookmark,
  });

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: '#c9d8c5' }}
  />
);

const Index = () => {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'feed', title: 'Feed' },
      { key: 'subscription', title: 'Sub' },
      { key: 'trending', title: 'Trend' },
      { key: 'bookmark', title: 'Book' }
    ]);
  
    return (
      <View style={{flex: 1}}>
          {/*<Text>*/}
          {/*    test*/}
        {/*  /!*</Text>*!/*/}
        {/*<View style={{height:0.05*layout.height, alignItems:'center', backgroundColor:"#c9d8c5", flexDirection:'row'}}>*/}
        {/*  <Text style={{fontSize:18, marginLeft: 0.03* layout.width}}>{routes[index]['title']}</Text>*/}
        {/*  <Text style={{right:20, position:"absolute"}}>Search</Text>*/}
        {/*</View>*/}
        {/*<TabView*/}
        {/*  renderTabBar={renderTabBar}*/}
        {/*  navigationState={{ index, routes }}*/}
        {/*  renderScene={renderScene}*/}
        {/*  onIndexChange={setIndex}*/}
        {/*  initialLayout={{ width: layout.width }}*/}
        {/*/>*/}
          <Trending/>
        </View>
    );
};

export default Index;