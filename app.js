const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', ()=>{
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.use(session({
  secret: 'mySecretKey123098qwerty',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)


app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurants'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`App is running at port ${port}`)
})