import Post from "./post";
import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {FIRST_POST, OTHER_POST} from "./constants";

const data1 = {
    title:"",
    name:"嘉然的狗",
    subname:"",
    content:"呃呃",
    avatar:"https://i.imgur.com/UrR8FiA.jpeg",
    imagePreview:"",
    images:[],
    commentNum:1,
    time: new Date()-1000000,
    isFirstPost: false,
    prefix: "#1",
    replies: {
        title:"",
        name:"嘉然的狗",
        subname:"",
        content:"呃呃",
        avatar:"https://i.imgur.com/UrR8FiA.jpeg",
        imagePreview:"",
        images:[],
        commentNum:1,
        time: new Date()-1000000,
        isFirstPost: false,
        prefix: "#1",
        replies: {
            title:"",
            name:"嘉然的狗",
            subname:"",
            content:"呃呃",
            avatar:"https://i.imgur.com/UrR8FiA.jpeg",
            imagePreview:"",
            images:[],
            commentNum:1,
            time: new Date()-1000000,
            isFirstPost: false,
            prefix: "#1"
        }
    }
}
const testData = [
    data1, data1
]

const FullPost = (props)=>{
    return (
        <ScrollView>
            <Post data={props.data} type={FIRST_POST} depth={0}/>
            {testData.map((comment, i)=><Post data={comment} type={OTHER_POST} depth={0}/>)}
            <View style={{height:50}}/>
        </ScrollView>

    )
}
export default FullPost;