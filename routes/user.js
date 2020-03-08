const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const { hashPassword } = require('../helper/authHelper')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next)
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  let errors = []
  if (!email || !password || !password2) {
    errors.push({ message: 'eamil, password 未填' })
  }
  if (password !== password2) {
    errors.push({ message: '兩次密碼輸入不同' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })

        return hashPassword(newUser.password, (hash) => {
          newUser.password = hash
            newUser
              .save()
              .then(user => {
                return res.redirect('/')
              })
              .catch(err => console.log(err))
        })
      }
    })
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

module.exports = router
