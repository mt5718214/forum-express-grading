const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const db = require('./models')
const helpers = require('./_helpers')
const { json } = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = helpers.getUser(req)
  next()
})

app.listen(port, () => {
  db.sequelize.sync()  //讓models與資料庫同步
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
