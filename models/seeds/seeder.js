const mongoose = require('mongoose')
const restaurantData = require('./restaurant.json')
const Restaurant = require('../restaurant.js')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')
  const { results } = restaurantData
  results.forEach(result => Restaurant.create(result))
  console.log('done')
})
