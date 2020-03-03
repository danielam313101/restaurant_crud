const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
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

app.get('/', (_req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

app.get('/restaurants', (_req, _res) =>
  res.redirect('/')
)

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

app.get('/restaurants/new', (_req, res) => {
  res.render('new')
})

app.post('/restaurants/new', (req, res) => {
  const restaurant = new Restaurant(req.body)

  restaurant.save()
  .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
  .catch(err => {
    console.error(err)
    return res.send(`somthing went wrong: ${err}`)
  })
})

app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .then(restaurant => res.render('detail', {restaurant}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .then(restaurant => res.render('edit', {restaurant}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

app.post('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
  .then(restaurant => {
    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.phone = req.body.phone
    restaurant.location = req.body.location
    restaurant.google_map = req.body.google_map
    restaurant.image = req.body.image
    restaurant.description = req.body.description
    restaurant.rating = req.body.rating
    return restaurant.save();
  })
  .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
  .catch(err => {
    console.error(err)
    return res.send(`somthing went wrong: ${err}`)
  })
})

app.post('/restaurants/:id/delete', (req, res) => {
  Restaurant.findById(req.params.id)
  .then(restaurant => {
    restaurant.remove()
  })
  .then(() => res.redirect('/'))
  .catch(err => {
    console.error(err)
    return res.send(`somthing went wrong: ${err}`)
  })
})

app.listen(port, () => {
  console.log(`App is running at port ${port}`)
})