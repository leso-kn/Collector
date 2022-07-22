/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Index from './app/index.js'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Channel from "./app/components/channel";
import FullPost from "./app/components/fullPost";
import {Search} from "./app/components/search";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Index} options={{
                    headerStyle: {backgroundColor: "#c9d8c5", elevation: 0},
                    headerShadowVisible: false
                }}/>
                <Stack.Screen name={"Channel"} component={Channel}/>
                <Stack.Screen name={"FullPost"} component={FullPost}/>
                <Stack.Screen name={"Search"} component={Search}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default App;
