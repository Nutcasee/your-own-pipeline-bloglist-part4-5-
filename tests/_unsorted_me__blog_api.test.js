const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('Blog endpoint tests', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url:
        'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url:
        'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url:
        'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0,
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0,
    },
  ]

  const loggedInUser = {
    username: 'jayeshmann',
    name: 'Jayesh Mann',
    password: 'cat'
  }

  // let token
  let headers

  beforeEach(async () => {
    await User.deleteMany({})
    await api.post('/api/users').send(loggedInUser)
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
    // await User.deleteMany({}) original in part4, up above -- part CICD, see no diffs
    // await api.post('/api/users').send(loggedInUser)

    const res = await api
      .post('/api/login')
      .send(loggedInUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // token = 'bearer ' + res.body.token
    // console.log('token ', token)

    headers = {
      'Authorization': `bearer ${res.body.token}`
    }
  })
  //no auth tests
  test('all blogs', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveLength(blogs.length)
  })

  test('id is defined', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
  })

  test('adding a blog fails if token is not provided', async () => {
    const newBlog = {
      title: 'latest blog',
      author: 'jayesh mann',
      url: 'https://notworkingurl.com',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const res = await Blog.find({})
    expect(res).toHaveLength(blogs.length)
  })
  //auth tests
  test('adding a blog with auth', async () => {
    const newBlog = {
      'title': 'latest blog',
      'author': 'jayesh mann',
      'url': 'https://notworkingurl.com',
      'likes': 10
    }

    await api
      .post('/api/blogs')
      .set(headers)
      // .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      // .expect(200)
      .expect('Content-Type', /application\/json/)

    const res = await Blog.find({})
    expect(res).toHaveLength(blogs.length + 1)
  })

  test('verify likes', async () => {
    const newBlog = {
      title: 'latest blog',
      author: 'jayesh mann',
      url: 'https://notworkingurl.com',
    }

    const res = await api
      .post('/api/blogs')
      .set(headers)
      // .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await Blog.findById(res.body.id)
    expect(result.likes).toBe(0)
  })

  test('verify title and url', async () => {
    const newBlog = {
      author: 'jayesh mann',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set(headers)
      // .set('Authorization', token)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('deletion of a single resource', async () => {
    const newBlog = {
      title: 'latest blog',
      author: 'jayesh mann',
      url: 'https://notworkingurl.com',
    }

    const res = await api
      .post('/api/blogs')
      .set(headers)
      // .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const aBlog = await Blog.findById(res.body.id)
    // console.log('aBlog for delete ', aBlog)

    // const allBlogs = await Blog.find({})
    await api
      .delete(`/api/blogs/${aBlog.id}`)
      .set(headers)
      // .set('Authorization', token)
      .expect(204)
  })
})

describe('When one user is already present', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'superuser', passwordHash })

    await user.save()
  })

  test('add new user', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'jayeshmann',
      name: 'Jayesh Mann',
      password: 'cat',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((n) => n.username)
    expect(usernames).toContain(newUser.username)
  })

  test('adding user with no username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      // username: 'jm',
      name: 'Jayesh Mann',
      password: 'cat',
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('`username` is required.')
    //expect(res.body).toEqual({ error: 'User validation failed: username: Path `username` is required.' })

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const names = usersAtEnd.map((n) => n.name)
    expect(names).not.toContain(newUser.name)
  })

  test('adding user with no password', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'jay',
      name: 'Jayesh Mann',
      // password: 'cat',
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body.error).toContain('password is shorter than has the minimum allowed length (3)')
    //expect(res.body).toEqual({ error: 'password missing' })

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map((n) => n.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('adding user with invalid username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'j',
      name: 'Jayesh Mann',
      password: 'cat',
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body.error).toContain('`username` (`j`) is shorter than the minimum allowed length (3)')
    // expect(res.body).toEqual({
    //   error: 'username should have more than 3 characters',
    // })

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map((n) => n.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('adding user with invalid password', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      'username': 'jay',
      'name': 'Jayesh Mann',
      'password': 'ca'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(res.body.error).toContain(' minimum allowed length (3)')
    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map((n) => n.username)
    expect(usernames).not.toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})