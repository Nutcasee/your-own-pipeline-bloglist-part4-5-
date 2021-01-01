const _ = require('lodash')
// const { reduce } = require('lodash')

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let max = blogs[0].likes
  let key = 0
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes
      key = i
    }
  }
  /* eslint-disable no-alert, no-console */
  console.log('key ', key)
  console.log('blogs[key] ', blogs[key])
  return blogs[key]
}

const mostBlogs = (blogs) => {
  const newBlogs = blogs
    .map((item) => item.author)

  // believe me... Idk what I'm doing... fuck lo..lo..lo..dash
  const counter = _.countBy(newBlogs)
  const counter2 = _.entries(counter)
  const result = _(counter2).uniq().sortBy((fruit) => counter[fruit]).reverse()
    .value()

  /* eslint-disable no-alert, no-console */
  console.log('counter ', counter2)
  console.log('result ', result)

  return result[0]
  /*
  const x = _.chain(newBlogs).countBy().toPairs().sortBy(1)
    .reverse()
    .map(0)
    .value()

  console.log('x ', x)

  result = _.head(_(array)
    .countBy()
    .entries()
    .maxBy(_.last))

  const max = newBlogs
    .map(item => item.)

  const result = _.maxBy(allNames, (each) => {
    each.
  })
  const newBlogs = blogs
    .map(item => item.author)
    .then(reduce((allNames, name) => {
      if (name in allNames) {
        allNames[name]++
      } else {
        allNames[name] = 1
      }
      return allNames
    }))
  const result = _.chain(newBlogs)
    .values()
    .maxBy('author')
    .value()
  console.log('result ', result)

  return result
  */
}

const mostLikes = (blogs) => {
  const newBlogs = _(blogs)
    .groupBy('author')
    .mapValues(a => (
      totalLikes(a)
    ))
    .entries()
    .value()

  const newBlogs2 = _(newBlogs)
    .reduce((a,b) => (
      a[1] > b[1] ? a : b))
  /* eslint-disable no-alert, no-console */
  console.log('newBlogs ', newBlogs2)
  return newBlogs2

  /*
  const newBlogs2 = _(newBlogs).uniq()
    .reduce((a,b) => (
      a[1] > b[1] ? a : b))
  console.log('newBlogs ', newBlogs2)
  return newBlogs2
  ---
  const newBlogs = _.groupBy(blogs, 'author')
  const newBlogs2 = _.entries(newBlogs)

  const newBlogs3 = newBlogs2
    .map(item => totalLikes(item[1]))

  console.log('newBlogs ', newBlogs2[1][1])
  console.log('newBlogs ', newBlogs3)

  return newBlogs2
  */
}

module.exports = {
  totalLikes, favoriteBlog, mostBlogs, mostLikes
}
