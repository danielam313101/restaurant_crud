const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (_req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

router.get('/search', (req, res) => {
  const name = req.query.restaurant_name.toLowerCase()

  Restaurant.find({name: {$regex: name, $options:'i'}})
    .lean()
    .then(restaurants => res.render('index', {restaurants, restaurant_name: name}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

module.exports = router