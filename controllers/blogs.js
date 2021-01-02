/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate(
    'user', { username: 1, name: 1 }
  )

  response.json(blogs)
  /* Blog
    .find({})
    .then((blogs) => {
      response.json(blogs)
    })
  */
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

/*
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
*/

blogsRouter.post('/', async (request, response) => {
  // console.log('request ', request.body)
  // console.log('request get autho... ', request.get('authorization'))
  // console.log('request.token ', request.token)
  const blog = new Blog(request.body)
  // console.log('blog by new Blog ', blog)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // console.log('decodedToken ', decodedToken)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const user = await User.findById(decodedToken.id)
  if (!blog.url || !blog.title) {
    return response.status(400).send({ error: 'title or url missing ' })
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  blog.user = user.id
  // console.log('blog by add user.id, likes = 0', blog)

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
  /*
  const body = request.body
  console.log('request.body ', request.body)
  // const token = tokenExtractor(request)
  tokenExtractor(request)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('decodedToken ', decodedToken)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    authorization: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })

  console.log('blog ', blog)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
  /*
  if (!request.body.likes) {
    request.body.likes = 0
  }
  request.body.user = user._id
  const blog = new Blog(request.body)
  */
  // logger.info('request.body', request.body)

  /*
  blog
    .save()
    .then((result) => {
      response.status(201).json(result)
    })

  /*
  const body = request.body

  const blog = new Blog({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
  */
})

/*
blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  // console.log('request ', request.body)
  // console.log('request get autho... ', request.get('authorization'))
  // console.log('request.token ', request.token)
  const comments = new Blog(request.body)
  console.log('comment by new Blog ', comments)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const user = await User.findById(decodedToken.id)
  if (!blog.url || !blog.title) {
    return response.status(400).send({ error: 'title or url missing ' })
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  blog.user = user.id
  // console.log('blog by add user.id, likes = 0', blog)

  blog.comments = comments
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})
*/

blogsRouter.delete('/:id', async (request, response) => {
  // console.log('request token', request.token)
  // const token = tokenExtractor(request)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // console.log('decodedToken ', decodedToken)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  // console.log('blog.user ', blog.user)
  // logger.info('blog.user.toString() ', blog.user.toString())
  // console.log('decodedToken.id ', decodedToken.id.toString())
  if (decodedToken.id !== blog.user.toString()) {
    return response.status(401).json({
      error: 'wrong user // only the creator can delete blogs'
    })
  }

  // console.log('...is about to remove blog ', blog)
  await blog.remove()
  user.blogs = user.blogs.filter(b => b.id.toString() !== request.params.id)
  await user.save()
  // await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  // console.log('blog from id', blog)
  // console.log('request.body ', request.body)

  const blogRequest = request.body
  // fuck this shit...maybe know better what you write
  // const blogRequest = new Blog(request.body)

  if (!blogRequest.url || !blogRequest.title) {
    return response.status(400).send({ error: 'title or url missing ' })
  }

  if (!blogRequest.likes) {
    blogRequest.likes = 0
  }

  blogRequest.user = blog.user

  // console.log('blogRequest ', blogRequest)

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogRequest, { new: true })

  // console.log('updated blog ', updatedBlog)

  response.status(201).json(updatedBlog)

  /*
  // don't need for an update like, right?
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  if (decodedToken.id !== blog.user.toString()) {
    return response.status(401).json({
      error: 'wrong user'
    })
  }
  ----
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // don't need to, right?
  user.blogs = user.blogs.map(b => b.id !== request.params.id ? b : updatedBlog)
  await user.save()

  response.status(201).json(savedBlog)
  /*
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user ? body.user._id : null
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { runValidators: true, context: 'query', new: true })
  console.log('updatedBlog at server ', updatedBlog)
  response.json(updatedBlog)
  /*
  Blog.findByIdAndUpdate(request.params.id, blog, { runValidators: true, context: 'query', new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
  */
})

module.exports = blogsRouter
