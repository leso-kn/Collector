export class RSSItemExtractor {
    data
    id
    url

    constructor(url, id, data) {
        this.url = url
        this.id = id
        this.data = data
        return (async () => this)()
    }

    getName() {
        return this.data.authors.map(x => x.name).join(", ")
    }

    getAvatar() {
        return this.data.avatar
    }

    getUpvoteNum() {
        return null
    }

    getCommentNum() {
        return null
    }

    getRepostNum() {
        return null
    }

    getImages() {
        let result = []
        if (this.data.imageUrl) {
            result.push({uri: this.data.imageUrl})
        }
        for (let item of this.data.enclosures) {
            if (item.mimeType.includes("image")) {
                result.push({uri: item.url})
            }
        }
        return result
    }

    getOuterContentURLs() {
        let result = []
        for (let item of this.data.enclosures) {
            if (item.mimeType.includes("audio")) {
                result.push({uri: item.url, type: "audio"})
            } else if (item.mimeType.includes("video")) {
                result.push({uri: item.url, type: "video"})
            }
        }
    }

    getHTMLContent() {
        return this.data.description || this.data.content
    }

    getPrefix() {
        return null
    }

    getTitle() {
        return this.data.title
    }

    getSubName() {
        return this.data.categories.map(x => x.name).join(", ")
    }

    getID() {
        return this.data.id
    }

    getPubTime() {
        return this.data.published
    }

    getRefPost() {
        return null
    }

    getContent() {
        return null
    }

    getHighlightUrl() {
        return null
    }

    getIdentifyName() {
        return this.data.identifyName
    }

    getType() {
        return null
    }

    async getComments(pn, lastID, sort = 1) {
        return null
    }

    async getReplies(pn, parentID, parentType, lastID) {
        return null
    }

    async getReposts(lastID) {
        return null
    }

    getIdentifyID() {
        return this.data.getIdentifyID()
    }

    getChannelIdentifyID() {
        return this.data.getChannelIdentifyID()
    }

    getChannelUrl() {
        return null
    }

    getParentID() {
        return null
    }

    getParentType() {
        return null
    }
}