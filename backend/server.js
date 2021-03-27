const express = require('express')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const dbConnection = require('./database') 
const MongoStore = require('connect-mongo')(session)
// const morgan = require('morgan')
const passport = require('./passport');
// Route requires
const app = express()
const PORT = process.env.PORT || 8000
// Route requires
// MIDDLEWARE
// app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

// // Sessions
app.use(
	session({
		secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		maxAge: new Date(Date.now() + 3600000),
		resave: false, //required
		saveUninitialized: false //required
	})
)
// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser

// Routes
const user = require('./routes/user')
app.use('/user', user)

// Starting Server 
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})
