const generateMsg = ( username, text) => {
    return {
        username,
        text: text,
        createdAt: new Date().getTime()
    }
}

const generateUrl = ( username, url) => {
    return {
        username,
        url: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateUrl,
}