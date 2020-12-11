const express = require('express')
const app = new express()
const port = 8000

const handlebars = require('express-handlebars')

app.set('view engine', 'hbs')

app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'planB',
    partialsDir: __dirname + '/views/partials/',
}))

app.use(express.static('public'))


//Helper functions, or “helpers” are functions that can be registered with Handlebars and can be 
//called within a template.
//stringhe che l'engine traduce in funzioni


const Ok = () => {
    return [
        {
            name: 'Katarina',
            lane: 'midlaner'
        },
        {
            name: 'Rick',
            lane: 'toplaner'
        }
    ]
}

app.get('/', (req, res) => {
    const lang  = req.get("accept-language").substring(0,2)
    const query = req.query
    const values = []
    for (const value in query) {
        values.push(query[value])
    }
    res.render('main', {layout: 'index', suggestedChamps: Ok(), listExists: true, values: values, lang: lang})
})

app.listen(port, () => console.log(`App listening on port ${port}`))