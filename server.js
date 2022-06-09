console.log('May Node be with you')


const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://tehuberjohn:MBxL6zKPAqCesB6X@cluster0.ceh9lz0.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        app.set('view engine', 'ejs')

        app.use(bodyParser.urlencoded({extended: true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())
        
        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
            .then(results => {
                res.render('index.ejs', {quotes: results})
                console.log(results)
                })
                .catch(error => console.error(error))
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
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
        app.listen(process.env.PORT || 3000, ()=> {
            console.log('Server is running')
                    })
      })


    .catch(error => console.error(error))