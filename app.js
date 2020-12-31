/* eslint-disable global-require */
const cors = require('cors')
const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.set('useCreateIndex', true)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })
mongoose.set('useFindAndModify', false)

app.use(cors())
// app.use(express.static('build'))
app.use(express.json()) // hahaahhh super important for newbie, fuck 5h pass 2020sep25.0032fri
app.use(middleware.tokenExtractor)
// woa...woa... come first/after blogsRouter is important, hah, 2020oct08.0333pm thu


app.use(express.static('build'))
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)





app.get('/health', (req, res) => {
  res.send('ok')
})



if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app
