import React, {useEffect, useReducer, useState} from 'react';

import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";

export const Drawer = (props)=>{
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label="Help"
                onPress={() => alert(1)}
            />
        </DrawerContentScrollView>
    )
}