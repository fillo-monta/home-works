const {Page} = require("./getPage")

const e = module.exports
e.getSinglePost = post => {
    const cards = post.reduce((acc,e) => {
        acc += `
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">${e.name}</h5>
                <p class="text-muted">${e.email}</p>
                <p><b>Body : </b>${e.body}</p>
            </div>
        </div> `
        return acc
    } 
    ,"")
    return Page(cards)
}