import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import mapSort from 'mapsort'


const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // const [newTitle, setTitle] = useState('')
  // const [newAuthor, setAuthor] = useState('')
  // const [newUrl, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      const sortedBlogs = mapSort(
        blogs,
        blog => blog.likes,
        (a,b) => b - a)
      console.log('sorted Blogs ', sortedBlogs)
      setBlogs(sortedBlogs)
    }
    fetchData()

    /*
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
    async function sortBlog() {
      const blogs = await blogService.getAll()
      return mapSort(
        blogs,
        blog => blog.likes,
        (a,b) => b - a)
    }
    setBlogs(sortBlog())
    */
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      console.log('user server ', user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      notifyWith(`${user.name} is logged in`)

      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error.response.data.error)
      notifyWith('wrong credentials', 'error')
      /*
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      */
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    // window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      // notifyWith(`a new blog ${newTitle} by ${newAuthor} added`)
      // setNewBlog('')
    } catch(error) {
      console.log(error.response.data.error)
      notifyWith(`${error.response.data.error} `, 'error')
    }

    /* blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notifyWith(`a new blog ${newTitle} by ${newAuthor} added`)
        // setNewBlog('')
        setTitle('')
        setAuthor('')
        setUrl('')
      })
      .catch(error => {
        console.log(error.response.data.error)
        notifyWith(`${error.response.data.error} `, 'error')
      })
    */
  }

  const updateLike = async (id) => {
    let blog = blogs.find(blog => blog.id === id)
    // console.log('changedBlog id ', id)
    // console.log('blog old likes', blog.likes)

    let changedBlog = { ...blog, likes: ++blog.likes }
    console.log('changedBlog new likes', changedBlog.likes)

    try {
      const updatedBlog = await blogService.update(id, changedBlog)
      console.log('updatedBlog new likes', updatedBlog.likes)
      setBlogs(blogs.map(blog => blog._id !== id ? blog : updatedBlog))
      // notifyWith(`a blog ${blog.title} by ${blog.author} updated`)
    } catch(error) {
      notifyWith(`${error.response.data.error} `, 'error')
      // notifyWith(`Blog '${blog.title}' was already removed from server`, 'error')
    }
  }

  const deleteBlog = async (id) => {
    let blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deleting(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        notifyWith(`a blog ${blog.title} by ${blog.author} removed`)
      } catch(error) {
        notifyWith(`${error} `, 'error')
        // notifyWith(`Blog '${blog.title}' was already removed from server`, 'error')
      }
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const bloglist = () => (
    <div>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog}
            updateLike={updateLike}
            deleteBlog={deleteBlog}
          />
        )}
      </div>
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>

      {user === null
        ?
        <div>
          <Notification notification={notification} />
          {loginForm()}
        </div>
        :
        <div>
          <Notification notification={notification} />

          <p>
            {user.name} logged in
            <button type="submit" onClick={handleLogout}>logout</button>
          </p>

          {blogForm()}

          {bloglist()}
        </div>
      }
    </div>
  )
}

export default App