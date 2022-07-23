import {Text, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {getTheme} from "../findService";


 const NavigationBar = (props)=>{
    return (
        <View style={{height: 50, alignItems: 'center', backgroundColor: getTheme().color, flexDirection: 'row'}}>
            <View style={{flexDirection: "row",marginLeft:10,marginTop:5, flex:1}}>
                <Text style={{fontSize: 20, marginLeft: 0.03 * layout.width}}>{props.title}</Text>
            </View>
            <View style={{flexDirection: "row", marginTop:0}}>
                <FontAwesome name={"search"} size={20} style={{marginRight:20}}/>
            </View>
        </View>
    )
}