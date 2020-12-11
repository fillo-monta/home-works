const express = require('express')
const fs = require('fs')
const red = require('./red')
const app = new express()
const port = 8000

app.use(express.static('public'))
//app.use(express.bodyParser());
app.use(express.urlencoded({ extended: true }));

const html = fs.readFileSync("./index.html", "utf-8")

app.get("/", (req, res) => {
    //res.send(html)
    res.send(red(html, {"[title]": "", "[align]": "left", "[description]": ""}))
})

app.post("/", (req, res) => {
    const userText = req.body.description
    console.log(userText)
    res.send(red(html, {"[title]": "CIAO", "[align]": "center", "[description]": userText}))
})


app.listen(port, () => console.log(`App listening on port ${port}`))



