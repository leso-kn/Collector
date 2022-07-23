import React, {useEffect, useReducer, useState} from 'react';
import {Posts} from "./Posts";
import {getCurrentServiceUrl} from "../findService";

export const Trending = ({navigation})=>{
    return <Posts url={getCurrentServiceUrl().trendingUrl} navigation={navigation}/>
}