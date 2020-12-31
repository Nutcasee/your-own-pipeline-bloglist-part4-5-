const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.vfloc.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const whenProcessLength5 = () => {
  //const password = process.argv[2]
  const namePerson = process.argv[3]
  const numberPerson = process.argv[4]

  /*
  const url = `mongodb+srv://fullstack:${password}@cluster0.vfloc.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)
  */
  const person = new Person({
    name: `${namePerson}`,
    number: `${numberPerson}`,
  })

  person.save().then(result => {
    console.log(`added ${namePerson} number ${numberPerson} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  whenProcessLength5()
}



/*
const password = process.argv[2]
const namePerson = process.argv[3]
const numberPerson = process.argv[4]

//console.log(password, namePerson, numberPerson)

const url = `mongodb+srv://fullstack:${password}@cluster0.vfloc.mongodb.net/phonebook?retryWrites=true&w=majority`

//  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${namePerson}`,
  number: `${numberPerson}`,
})

person.save().then(result => {
  console.log(`added ${namePerson} number ${numberPerson} to phonebook`)
  mongoose.connection.close()
})
*/

/*
if (process.argv.length < 5) {
  console.log('Please provide as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

Note.find({ important: true }).then(result => {
  // ...
})

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})
*/
