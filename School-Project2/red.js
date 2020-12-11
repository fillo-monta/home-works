module.exports =  function (html, items){
        for (const [key, value] of Object.entries(items)) {
                console.log(`${key}: ${value}`)
                html = html.replace(key, value)
        }
        return html
}
