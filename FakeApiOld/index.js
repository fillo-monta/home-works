const express = require("express")
const {readFileSync} = require("fs")
const bodyParser = require("body-parser")
const fetch = require("node-fetch")
const {build} = require('./assets')
const port = 8080
const app = new express()

app.use(express.static("public"))
app.use(bodyParser.json())
let html = readFileSync("./index.html", "utf-8")

app.get("/", (req, res) => {
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(data => {
            let posts = []
            data.forEach(e => {
                posts.push( {"userId": e.userId, "id" : e.id, "title" : e.title, "body" : e.body  } ) 
            });
            console.log(posts[0])
            html = build(html, "[posts]", posts)
            res.send(html)
        })
        .catch(error => console.error(error)) 
})

app.listen(port, () => console.log(`App listening on port ${port}`))