import Dialog, {DialogContent} from 'react-native-popup-dialog';
import React, {useState} from "react";
import DialogTitle from "react-native-popup-dialog/dist/components/DialogTitle";
import {TextInput} from "react-native";
import DialogFooter from "react-native-popup-dialog/dist/components/DialogFooter";
import DialogButton from "react-native-popup-dialog/dist/components/DialogButton";

export const AddDialog = React.memo((props) => {
    const [visible, setVisible] = useState(true)
    const [text, changeText] = useState("Name")

})