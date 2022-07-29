/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import Index from './app/index.js'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Channel from "./app/components/channel";
import FullPost from "./app/components/fullPost";
import {Search} from "./app/components/search";
import {Group} from "./app/components/Group";
import {LogBox} from "react-native";
import {getTheme} from "./app/utils";

const Stack = createNativeStackNavigator();
// LogBox.ignoreAllLogs();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerStyle: {backgroundColor: getTheme().color, elevation: 0}
            }}>
                <Stack.Screen name="Home" component={Index} options={{
                    headerShadowVisible: false
                }}/>
                <Stack.Screen name={"Channel"} component={Channel}/>
                <Stack.Screen name={"FullPost"} component={FullPost}/>
                <Stack.Screen name={"Search"} component={Search}/>
                <Stack.Screen name={"Group"} component={Group}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default App;
