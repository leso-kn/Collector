import React, {useEffect, useReducer, useState} from 'react';
import {Posts} from "./Posts";
import {getCurrentServiceUrl} from "../utils";

export const Trending = ({navigation, route})=>{
    return <Posts urls={[route.params.url]} navigation={navigation} />
}