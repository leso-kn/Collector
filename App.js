import React, {useEffect} from 'react';
import Index from './app/index.js'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Channel from "./app/components/channel";
import FullPost from "./app/components/fullPost";
import {Search} from "./app/components/search";
import {Group} from "./app/components/Group";
import {getTheme} from "./app/utils";
import FlashMessage from "react-native-flash-message";
import {Home} from "./app/components/Home";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerStyle: {backgroundColor: getTheme().color, elevation: 0},
                animation: "fade"
            }}>
                <Stack.Screen name={"Home"} component={Home}/>
                <Stack.Screen name={"Channel"} component={Channel}/>
                <Stack.Screen name={"FullPost"} component={FullPost}/>
                <Stack.Screen name={"Search"} component={Search}/>
                <Stack.Screen name={"Group"} component={Group}/>
            </Stack.Navigator>
            <FlashMessage position="top"/>
        </NavigationContainer>

    );
};


export default App;
