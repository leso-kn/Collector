import {articlePageUrl, recommendApiUrl, searchArticleApiUrl, trendingApiUrl} from "./BiliArticleLinks";
import {searchApiUrl} from "../bilispace/BiliSpaceLinks";
import {BiliArticleRecommendsExtractor} from "./Extractors/BiliArticleRecommendsExtractor";
import {BiliArticleExtractor} from "./Extractors/BiliArticleExtractor";
import {BiliCommentExtractor} from "../bilispace/Extractors/BiliCommentExtractor";

export const getBiliArticleService = async (url, id, data) => {
    if(url.includes(trendingApiUrl) || url.includes(recommendApiUrl)){
        return new BiliArticleRecommendsExtractor(url)
    }else if(url.includes(articlePageUrl)){
        if (id === "biliComment" && data) {
            return new BiliCommentExtractor(data)
        }
        return new BiliArticleExtractor(url, url.split(articlePageUrl)[1].split("&")[0])
    }
    return null
}

export const serviceUrls = {
    getSearchChannelUrl:(query)=>searchApiUrl + `${query}&page=0`,
    getTrendingUrls: ()=>[
        {label: "Trending of yesterday", url: trendingApiUrl + "3"},
        {label: "Trending of the day before yesterday", url: trendingApiUrl + "4"},
        {label: "Trending of the week", url: trendingApiUrl + "1"},
        {label: "Trending of the month", url: trendingApiUrl + "2"},
        {label: "Recommend for you", url: recommendApiUrl+"0"},
        {label: "Game", url: recommendApiUrl+"1"},
        {label: "Anime", url: recommendApiUrl+"2"},
        {label: "Movie", url: recommendApiUrl+"28"},
        {label: "Life", url: recommendApiUrl+"3"},
        {label: "Hobby", url: recommendApiUrl+"29"},
        {label: "Light Novel", url: recommendApiUrl+"16"},
        {label: "Technology", url: recommendApiUrl+"17"},
        {label: "Note", url: recommendApiUrl+"41"},
    ],
    getSearchPostUrl: (user, query)=> {
        return searchArticleApiUrl + `${query}`
    }
}