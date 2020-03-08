const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const { authenticated } = require('../middleware/auth')

router.get('/', authenticated, (req, res) => {
  Restaurant.find({userId: req.user._id})
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(err => {
      console.error(err)
      return res.send(`something went wrong: ${err}`)
    })
})

router.get('/search', authenticated, (req, res) => {
  const name = req.query.restaurant_name.toLowerCase()

  Restaurant.find({name: {$regex: name, $options:'i'}, userId: req.user._id})
    .lean()
    .then(restaurants => res.render('index', {restaurants, restaurant_name: name}))
    .catch(err => {
      console.error(err)
      return res.send(`something went wrong: ${err}`)
    })
})

module.exports = router