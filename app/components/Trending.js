import React from 'react';
import {Posts} from "./Posts";

export const Trending = ({navigation, route})=>{
    return <Posts urls={[route.params.url]} navigation={navigation} />
}