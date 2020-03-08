const mongoose = require('mongoose')
const restaurantData = require('./restaurant.json')
const Restaurant = require('../restaurant.js')
const { hashPassword } = require('../../helper/authHelper')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
const User = require('../user')

const userInfoList = [
  {
    email: 'user1@example.com',
    name: 'user1',
    password: '12345678'
  },
  {
    email: 'user2@example.com',
    name: 'user2',
    password: '12345678'
  }
]

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  const { results } = restaurantData
  user1Restuarnts = results.filter(result => !(result.id % 2))
  user2Restuarnts = results.filter(result => result.id % 2)

  userInfoList.forEach((user) => {
    hashPassword(user.password, (hash) => {
      User.create({...user, password: hash}).then((user) => {
        if (user.name === 'user1') {
          user1Restuarnts.forEach(restaurant => {
            Restaurant.create({...restaurant, userId: user._id})
            console.log(`restaurant name: ${restaurant.name} created for user: ${user.name}`)
          })
        } else if(user.name === 'user2') {
          user2Restuarnts.forEach(restaurant => {
            Restaurant.create({...restaurant, userId: user._id})
            console.log(`restaurant name: ${restaurant.name} created for user: ${user.name}`)
          })
        }
      }).catch((error) => console.log('error', error))
    })
  })

  console.log('done')
})
