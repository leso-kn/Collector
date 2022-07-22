import {requestOption} from "../BiliSpaceService";

const axios = require("axios");

export class BiliSearchExtractor{
    results
    data
    constructor(url) {
        return (async () => await axios.get(url, requestOption).then(res => {
            this.data = res.data.data
            this.results = res.data.data.result
            return this
        }))() // https://stackoverflow.com/a/50885340
    }
    getResults(){
        return this.results
    }
    getHasMore(){
        return this.data.numPages !== this.data.page
    }
}