const express = require("express")
const fetch = require("node-fetch")
const bodyParser = require("body-parser")
const { getPosts } = require("./getPosts")
const { getSinglePost } = require("./getSinglePosts")
const app = new express()
const PORT = 8080

app.use(bodyParser.json())

app.get("/", (req,res) => {
    fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(posts => {
        res.send(getPosts(posts))
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
                //res.render("show_posts", {layout: "show_posts", post: posts[postId-1], comments: comments})
                res.send(getSinglePost(comments))
            })
        })
})



app.listen(PORT, () => console.log(`App listening on port ${PORT}`))