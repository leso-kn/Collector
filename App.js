import React, {useEffect} from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Channel from "./app/components/channel";
import FullPost from "./app/components/fullPost";
import {Search} from "./app/components/search";
import {Group} from "./app/components/Group";
import {getTheme} from "./app/utils";
import FlashMessage from "react-native-flash-message";
import {Home} from "./app/components/Home";
import {Trending} from "./app/components/Trending";
import {FreeCopy} from "./app/components/FreeCopy";
import {Article} from "./app/components/Article";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer theme={getTheme().navigationTheme}>
            <Stack.Navigator screenOptions={{
                headerStyle: {backgroundColor: getTheme().color, elevation: 0},
                animation: "fade"
            }}>
                <Stack.Screen name={"Home"} component={Home}/>
                <Stack.Screen name={"Channel"} component={Channel}/>
                <Stack.Screen name={"FullPost"} component={FullPost}/>
                <Stack.Screen name={"Search"} component={Search}/>
                <Stack.Screen name={"Group"} component={Group}/>
                <Stack.Screen name={"Trending"} component={Trending}/>
                <Stack.Screen name={"FreeCopy"} component={FreeCopy}/>
                <Stack.Screen name={"Article"} component={Article}/>
            </Stack.Navigator>
            <FlashMessage position="top"/>
        </NavigationContainer>

    );
};


export default App;
