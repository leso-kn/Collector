import React from 'react';
import {
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

const Feed = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
  );
  
const Subscription = () => (
<View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const Trending = ()=>(
  <View style={{flex: 1, backgroundColor:"#FFFFFF"}}/>
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
        <View style={{height:0.05*layout.height, alignItems:'center', backgroundColor:"#c9d8c5", flexDirection:'row'}}>
          <Text style={{fontSize:18, marginLeft: 0.03* layout.width}}>{routes[index]['title']}</Text>
          <Text style={{right:20, position:"absolute"}}>Search</Text>
        </View>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />
        </View>
    );
};

export default Index