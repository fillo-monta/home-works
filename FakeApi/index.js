const express = require("express")
const fetch = require("node-fetch")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = new express()
const port = 8080

app.use(bodyParser.json())
app.use(express.static('public'))
//app.engine('hbs', handlebars({
//    extname: 'hbs',
//}))
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/',
    extname: 'hbs',
    defaultLayout: 'index',
}))
app.set('view engine', 'hbs')

function getUser(users,id){
    users.forEach(e => {
        if (e.id === id){
            return e
        }
    });
}


app.get("/", (req, res) =>{
    fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(posts => {
        fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(users => {
            
            res.render("index", {posts: posts, users: users})
        })
    })
    .catch(error => console.error(error)) 
})


app.get("/posts/:id", (req, res) => {
    const postId = req.params.id
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(posts => { 
            //res.render("show_posts", {layout: "show_posts", post: posts[postId-1]})
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
            .then(res => res.json())
            .then(comments => {
                res.render("show_posts", {layout: "show_posts", post: posts[postId-1], comments: comments})
            })
        })
})


app.listen(port, () => console.log(`App listening on port ${port}`))