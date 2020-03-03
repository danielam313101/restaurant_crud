const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', ()=>{
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))

app.use('/restaurants', require('./routes/restaurants'))

app.get('/', (_req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

app.get('/search', (req, res) => {
  const name = req.query.restaurant_name.toLowerCase()

  Restaurant.find({name: {$regex: name, $options:'i'}})
    .lean()
    .then(restaurants => res.render('index', {restaurants, restaurant_name: name}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

app.listen(port, () => {
  console.log(`App is running at port ${port}`)
})