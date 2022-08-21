/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-url-polyfill/auto';
String.prototype.replaceAll = function(from, to){
    let value = this
    while(value.includes(from))value = value.replace(from,to)
    return value.toString()
}




AppRegistry.registerComponent(appName, () => App);
