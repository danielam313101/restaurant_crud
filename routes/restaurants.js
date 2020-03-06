const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

router.get('/', (_req, _res) =>
  res.redirect('/')
)

router.get('/new', (_req, res) => {
  res.render('new')
})

router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .then(restaurant => res.render('detail', {restaurant}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

router.post('/', (req, res) => {
  const restaurant = new Restaurant(req.body)

  restaurant.save()
  .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
  .catch(err => {
    console.error(err)
    return res.send(`somthing went wrong: ${err}`)
  })
})

router.get('/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .then(restaurant => res.render('edit', {restaurant}))
    .catch(err => {
      console.error(err)
      return res.send(`somthing went wrong: ${err}`)
    })
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router