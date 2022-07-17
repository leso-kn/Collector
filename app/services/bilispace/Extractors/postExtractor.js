const axios = require("axios");
const option = {
    proxy:false
}
export class PostExtractor {
    url
    data
    constructor(url){
        this.url = url;
        return (async ()=>await axios.get(url, option).then(res=>{
            this.data = res.data.data
            return this
        }))() // https://stackoverflow.com/a/50885340
    }
    getName(){
        return this.data["cards"][0]['desc']['user_profile']['info']['uname']
    }
    getAvater(){
        return this.data["cards"][0]['desc']['user_profile']['info']['face']
    }
}

