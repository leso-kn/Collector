import axios from "axios";
import {requestOption} from "../BiliSpaceService";
import {mobileSpaceUrl, postPageUrl, spaceApiUrl, trendingApiUrl} from "../BiliSpaceLinks";

export class BiliChannelExtractor {
    data
    card
    url

    constructor(url) {
        return (async () => await axios.get(url, requestOption).then(res => {
            this.url = url
            this.data = res.data.data
            this.card = this.data.card
            return this
        }))()
    }

    getName() {
        return this.card.name
    }

    getAvatar() {
        return this.card.face.replace("http", "https")
    }

    getFanNum() {
        return this.card.fans
    }

    getIdentifyName() {
        return this.card.mid
    }

    getFollowNum() {
        return this.card.attention
    }

    getInfo() {
        return this.card.sign
    }

    getLikeNum() {
        return this.data.like_num
    }

    getAdditionalText() {
        return this.card.Official.title
    }

    getHeadImgUrl() {
        return this.data.space.l_img
    }

    getHeadImgRatio() {
        return 1 / 6.4
    }

    getPosts(pn, lastID) {
        let randomID;
        !this.card && (randomID = this.url.split("fake_uid=")[1].split('&')[0])
        return axios.get(this.card ? spaceApiUrl + this.getIdentifyName() + `&offset_dynamic_id=${lastID}`
            : this.url + `&hot_offset=${lastID}`).then(res => {
                let result = res.data.data.cards || []
                result.hasMore = () => res.data.data.has_more
                result.getLastID = () => res.data.data.cards[res.data.data.cards.length - 1].desc.dynamic_id_str
                for (let item of result) {
                    item.getIdentifyID = ()=> "biliSpace" + item.desc.dynamic_id_str
                    item.url = postPageUrl + item.desc.dynamic_id_str
                    item.getTime = () => item.desc.timestamp * 1000
                }
                return result
            }
        )
    }

    getUrl() {
        return mobileSpaceUrl + this.getIdentifyName()
    }

    getServicePrefix() {
        return "biliSpace"
    }

    getIdentifyID() {
        return this.getServicePrefix() + this.getIdentifyName()
    }
}