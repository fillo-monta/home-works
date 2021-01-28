const express = require("express")
const fetch = require("node-fetch")
const bodyParser = require("body-parser")
const app = new express()
const port = 8080

app.use(bodyParser.json())

//const array = [2,34,45,46,56,56,56,45,3,2,3,453,65,766876,543231,2,4,576]
//const words = ["ciao", "mare", "imbarcazione", "navicella", "otto", "leo", "neo", "ottovolanate"]
//const id = 1

app.get("/accreditamento", (req, res) => {
    res.json({"nome": "Filippo", "cognome": "Montanari"})
})

/*
app.post("/somma-pari", (req, res) => {
    // const array = req.body.numbers
    const sum = array.filter(e => (e - 1) % 2).reduce((acc, e) => acc += e, 0)
    res.json({"sum": sum})
})
*/

/*
app.get("/lista-parole-a", (req, res) => {
    // const words = req.body
    const parolepari = words.filter(e => e.length > 4)
    const parole = parolepari.reduce((acc, e, i, arr) => i === arr.length -1 ? acc += e : acc += e + " ", "")
    //console.log(parole.replace(/ /g, "ok"))
    res.json({"count": parolepari.length, "words": parole})
})
*/

/*
app.get("/comments", (req, res) => {
    // const id = req.params.id
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
        .then(res => res.json())
        .then(comments => {
            const num = comments[0].body.replace(/\n/g, " ").split(" ").length
            res.json({"count":num})
        })
})
*/

app.listen(port, () => console.log(`App listening on port ${port}`))