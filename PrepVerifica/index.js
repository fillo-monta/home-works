const express = require("express")
const fetch = require("node-fetch")
const bodyParser = require("body-parser")
const { getPosts } = require("./getPosts")
const { Page } = require("./getPage")
const { getSinglePost } = require("./getSinglePosts")
const { call } = require("./utils")
const app = new express()
const PORT = 8080
const url = "https://jsonplaceholder.typicode.com/"

app.use(bodyParser.json())

app.get("/", (req,res) => {
    call(url + "posts").then(posts => {res.send(Page(getPosts(posts)))})
})

app.get("/posts/:id", (req, res) => {
    const postId = req.params.id
    call(url + "posts/" + postId + "/comments").then(comments => {res.send(Page(getSinglePost(comments)))})
})



app.listen(PORT, () => console.log(`App listening on port ${PORT}`))