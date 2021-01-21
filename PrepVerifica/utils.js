const fetch = require("node-fetch")

const e = module.exports
e.call = (url) => {
    return fetch(url)
    .then(res => res.json())
}