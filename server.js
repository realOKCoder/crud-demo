console.log('May Node be with you')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://fraz:fraz@cluster0.l7eo0jt.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')

        app.use(bodyParser.urlencoded({extended: true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        app.listen(3000, () => {
                console.log('listening on 3000')
        })
        
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
            .then(results => {
                res.render('index.ejs', {quotes: results})
                console.log(results)
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                {  },
                {
                  $set: {
                    name: req.body.name,
                    quote: req.body.quote
                  }
                },
                {
                  upsert: true
                }
              )
              .then(result => {
                res.json('Success')
               })
              .catch(error => console.error(error))
        })

        app.delete('/quotes', (req,res) => {
            quotesCollection.deleteOne(
                {name: req.body.name}
            )
                .then(result => {
                    if (result.deletedCount === 0){
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vader quote')
                })
                .catch(error => console.error(error))
        })
      })


    .catch(error => console.error(error))