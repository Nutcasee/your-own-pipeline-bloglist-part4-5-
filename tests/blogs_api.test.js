/* eslint-disable linebreak-style */
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain('sdfsdfs')
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body).toEqual(JSON.parse(JSON.stringify(blogToView)))
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      /* eslint-disable no-alert, no-console */
      console.log(validNonexistingId)

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '7878fhghgdfgd'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    let token = ''
    const loggedInUser = {
      username: 'jayeshmann',
      name: 'Jayesh Mann',
      password: 'cat',
    }

    beforeEach(async () => {
      await api
        .post('/api/users')
        .send(loggedInUser)

      const response = await api
        .post('/api/login')
        .send(loggedInUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      token = response.body.token
      /* eslint-disable no-alert, no-console */
      console.log('token ', token)
    })

    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'blog without likes is added',
        author: 'unji',
        url: 'fhfh.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      /* eslint-disable no-alert, no-console */
      console.log('blogsAtEnd ', blogsAtEnd)
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      expect(titles).toContain('blog without likes is added')
    })

    test('fails with status code 401 if a token is not provided', async () => {
      const newBlog = {
        title: 'blog without likes is added',
        author: 'unji',
        url: 'fhfh.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {
        url: 'datainvalid.com',
      }
      /* eslint-disable no-alert, no-console */
      console.log('token 2', token)

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
  })
  /*
  describe('deletion of a blog', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const user = new User({ username: 'root', password: 'sekret' })
      await user.save()
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(
        helper.initialBlogs.length - 1
      )

      const contents = blogsAtEnd.map(r => r.content)

      expect(contents).not.toContain(blogToDelete.content)
    })
  })
  */
  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const user = new User({ username: 'root', password: 'sekret' })
      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})