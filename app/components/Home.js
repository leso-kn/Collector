import React, {useEffect} from 'react';
import Index from "../index";
import {Drawer} from "./Drawer";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {getTheme} from "../utils";

const HomeTab = createDrawerNavigator()

export const Home = ({navigation})=>{
    useEffect(()=>{
        navigation.setOptions({headerShown:false})
    },[])
    return (
        <HomeTab.Navigator
            drawerContent={(props)=><Drawer {...props}/>}
            screenOptions={{
                headerStyle: {backgroundColor: getTheme().color, elevation: 0},
                headerTintColor: getTheme().buttonColor,
                animation: "fade"
            }}>
            <HomeTab.Screen name="Index" component={Index} options={{
                headerShadowVisible: false
            }}/>
        </HomeTab.Navigator>
    )
}