import React, {useEffect, useReducer, useState} from 'react';
import {Posts} from "./Posts";
import {getCurrentServiceUrl} from "../findService";

export const Trending = ({navigation, randomID})=>{
    return <Posts urls={[getCurrentServiceUrl().getTrendingUrl()]} navigation={navigation} randomID={randomID}/>
}