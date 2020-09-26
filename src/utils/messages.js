const generateMsg = (text) => {
    return {
        text: text,
        createdAt: new Date().getTime()
    }
}

const generateUrl = (url) => {
    return {
        url: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateUrl,
}