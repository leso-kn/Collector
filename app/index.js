import React from 'react';
import {
    Button,
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
import Post from "./post";
import FullPost from "./fullPost";

const data = {
    title:"测试dddd",
    name:"沉思",
    subname:"测试1",
    content:"知道怎么回复的，就正常回复；不知道怎么回复的，就回复典。别人问你哪里典？就回典中典！别人问你哪里典中典？就回他急了！别人问你哪里急了？就回他这就是某某某的丑态！别人问你哪里丑态？你直接反手截图挂在自己的小团体里寻求认同。至此，互联网上再无人能打败你！",
    avatar:"https://i.imgur.com/UrR8FiA.jpeg",
    imagePreview:"https://i.imgur.com/UrR8FiA.jpeg",
    images:[{uri:"https://i.imgur.com/UrR8FiA.jpeg"}],
    upvoteNum:10,
    commentNum:10,
    forwardNum: 10,
    time: new Date(),
    isFirstPost: true,
    prefix: "#0"
}
const metadata = {
    title:"",
    name:"嘉然的狗",
    subname:"",
    content:"呃呃",
    avatar:"https://i.imgur.com/UrR8FiA.jpeg",
    imagePreview:"",
    images:[],
    commentNum:1,
    time: new Date()-1000000,
    isFirstPost: false,
    prefix: "#1"
}
const data1 = {
    title:"",
    name:"嘉然的狗",
    subname:"",
    content:"呃呃",
    avatar:"https://i.imgur.com/UrR8FiA.jpeg",
    imagePreview:"",
    images:[],
    commentNum:1,
    time: new Date()-1000000,
    isFirstPost: false,
    prefix: "#1",
    replies: {
        title:"",
        name:"嘉然的狗",
        subname:"",
        content:"呃呃",
        avatar:"https://i.imgur.com/UrR8FiA.jpeg",
        imagePreview:"",
        images:[],
        commentNum:1,
        time: new Date()-1000000,
        isFirstPost: false,
        prefix: "#1",
        replies: {
            title:"",
            name:"嘉然的狗",
            subname:"",
            content:"呃呃",
            avatar:"https://i.imgur.com/UrR8FiA.jpeg",
            imagePreview:"",
            images:[],
            commentNum:1,
            time: new Date()-1000000,
            isFirstPost: false,
            prefix: "#1"
        }
    }
}

const Feed = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }} >
        <Post data={data} isFirstPost={true} depth={0}/>
        <FlatList data={[1, 2, 3, 4]} renderItem={({item}) => <Text>{item}</Text>}>
        </FlatList>
        <Button title={"test1"} onPress={()=>alert("test")}/>
    </View>
  );
  
const Subscription = () => (
<View style={{ flex: 1, backgroundColor: '#ececec' }} >
    <FullPost data={data} data1={data1}/>
</View>
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

export default Index;