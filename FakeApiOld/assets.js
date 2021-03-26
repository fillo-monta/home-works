const e = module.exports

e.build = (html, tag, data) => {
    let elencoPost = ""
    data.forEach(e => {
        elencoPost +=  "<li>"
        //elencoPost +=  "<b>Title:</b><br />" + e.title + "<br />"
        //elencoPost +=  "<b>Body:</b><br />" + e.body + "<br />"
        for (const [key, value] of Object.entries(e)) {
            console.log(`${key}: ${value}`)
            elencoPost +=  "<b>" + key + "</b><br />"
            elencoPost +=  value + "<br />"
        }
        elencoPost +=  "</li>"
    });

    html = html.replace(tag, elencoPost)
    return html
}