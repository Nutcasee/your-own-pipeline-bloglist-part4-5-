//const { request, response } = require('express')
const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const Person = require('./models/person')

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

morgan.token('nameNumber', function getRequestBody (req) {
  return `{"name":"${req.body.name}","number":"${req.body.number}"}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :nameNumber'))
app.use(express.static('build'))

/* unfinished, the idea is... to intend to skip nameNumber when GET...
morgan('nameNumber', {
  skip: function (req, res) {
    return res.headers['content-type']
  }
})
*/
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person.estimatedDocumentCount(function (err, count) {
    if (err) {
      console.log(err)
    } else {
      console.log('Estimated Count :', count)
      const message = `<div>Phonebook has info for ${count} people</div>
      <br />
      ${new Date()}`
      res.send(message)
    }
  })
  /* countDocuments()
  Person.countDocuments({}, function(err, count){
    console.log( "Number of docs: ", count );
  })
  */
  /*
  const message = `<div>Phonebook has info for  people</div>
  <br />
  ${new Date()}`
  res.send(message)*/
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
  //res.json(persons)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      //response.json(person) -- test, it seems the same, why?
    })
    .catch(error => next(error))
  /*const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  */
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
  /*const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
  */
})

app.put('/api/persons/:id', (request, response, next) => {
  //console.log('request.params.id is: ', request.params.id)
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { runValidators: true, context: 'query', new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      console.log('error data is: ', error.message)
      next(error)
    })
})

/*
const generateId = () => {
  const getId = Math.floor(Math.random(0,1) * 1000000)
  return getId + 1
  /*const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

const checkPerson = (checkName) => {

  /*
  Person
    .find({ name : `${body.name}` })
    .then(person => {
      if (person) {
        return response.status(400).json({
          error: 'The name already exists in the phonebook'
        })
      } else {
        person.save().then(savedPerson => {
          response.json(savedPerson)
          console.log(savedPerson)
        })
      }
      //response.json(person) -- test, it seems the same, why?
    })
    .catch(error => next(error))
  /*
  Person.find({"name":`${checkName}`}).then(persons => {
    res.json(persons)
  })
  return Person.find({"name":`${checkName}`})

  /*console.log('checkName is: ', checkName)
  const personsName = persons.map(person => person.name.toLowerCase())

  return (
    personsName.includes(checkName.toLowerCase())
  )
}
*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  console.log('body.name is:', `${body.name}`)

  const person = new Person ({
    name: body.name,
    number: body.number,
    //id: generateId(),
  })

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
      console.log(savedPerson)
    })
    .catch(error => next(error))

  /*else {
    Person
    .findOne({ name : `${body.name}` })
    .then(one => {
      if (one) {
        return response.status(400).json({
          error: 'The name already exists in the phonebook'
        })
      } else {
        person.save().then(savedPerson => {
          response.json(savedPerson)
          console.log(savedPerson)
        })
      }
    })
    .catch(error => next(error))
  }

  /*else if (checkPerson(body.name)) {
      return response.status(400).json({
        error: 'The name already exists in the phonebook'
      })
  }
  */
  /*
  const person = new Person ({
    name: body.name,
    number: body.number,
    //id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
    console.log(savedPerson)
  })
  */
  /*
  const person = {
    name: body.name,
    number: body.number || '',
    data: new Date(),
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
  */
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
    //json({ error: error.message }) could be use here, too... can't see the diff
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
