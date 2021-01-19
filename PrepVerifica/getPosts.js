const {Page} = require("./getPage")


const x = `<div class="row row-cols-1 row-cols-md-3">
</div>`

const e = module.exports
e.getPosts = posts => {
    let cards = '<div class="row row-cols-1 row-cols-md-3">'
    cards += posts.reduce((acc,e) => {
        acc += `
        <div class="col mb-4">
            <div class="card border-dark mb-3" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${e.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${e.userId}</h6>
                    <p class="card-text">${e.body}</p>
                    <a href="/posts/${e.id}" class="card-link">See more</a>
                </div>
            </div>
            </div> `
        return acc
    } 
    ,"")
    cards += '</div>'

    return Page(cards)
}