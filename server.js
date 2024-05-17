const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const connectionString = "mongodb+srv://piyushps2235:piyushmongo%40123@piyush.5b6avch.mongodb.net/?retryWrites=true&w=majority&appName=Piyush"

const MongoClient = require('mongodb').MongoClient

MongoClient.connect(connectionString)
    .then(client => {
        // ...
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.set('view engine', 'ejs')
        app.use(express.static('public'))
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())

        app.listen(3000, function () {
            console.log('listening on 3000')
        })

        app.get('/', (req, res) => {
            const cursor = db.collection('quotes')
                .find()
                .toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
        })

        app.post('/quotes', (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection
                .findOneAndUpdate(
                    { name: 'Piyush' },
                    {
                        $set: {
                            name: req.body.name,
                            quote: req.body.quote,
                        },
                    },
                    {
                        upsert: true,
                    }
                )
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection
                .deleteOne({ name: req.body.name })
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vader's quote`)
                })
                .catch(error => console.error(error))
        })
    })
    .catch(console.error)