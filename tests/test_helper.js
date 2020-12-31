const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'hgfhfhghxgfsfs',
    author: 'idk iasdoisd',
    url: 'wioweijdjfsds.com',
  },
  {
    title: 'sdfsdfs',
    author: 'idk',
    url: '90i23434k.com',
    likes: 58768
  }
]

const initialUsers = [
  {
    username: 'hellas',
    name: 'Arto Hellas',
    password: 'idk'
  },
  {
    username: 'mluukkai',
    name: 'Mluukkai',
    password: 'salainen'
  },
  {
    username: 'jayeshmann',
    name: 'Jayesh Mann',
    password: 'cat',
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'idk iasdoisd',
    url: 'wioweijdjfsds.com',
    likes: 57698779898
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb
}
