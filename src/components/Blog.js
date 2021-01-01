import React, { useState } from 'react'

const Blog = ({ blog, updateLike, deleteBlog }) => {
  // console.log('blog ', blog)
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="togglableContent">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} data-cy="view">view</button>
      </div>
      <div style={showWhenVisible} className="togglableContent2">
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          <span data-cy="likes">{blog.likes}</span>
          <button id="like-button" onClick={() => updateLike(blog.id)}>like</button>
        </div>
        {blog.user ? blog.user.name
          : null}
        <div>
          {blog.user
            ? <button id="remove-button" onClick={() => deleteBlog(blog.id)}>remove</button>
            : null}
        </div>
      </div>
    </div>
  )
}

export default Blog
