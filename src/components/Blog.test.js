/**
 * @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    title: 'sdfs',
    author: 'sdfs',
    url: 'sdsdfsdfdsfs.com',
    id: '5f737da91fc2ff0e7c902bde',
    user: null
  }
  const updateLike = jest.fn()
  const deleteBlog = jest.fn()
  beforeEach(() => {
    component = render(
      <Blog key={blog.id} blog={blog}
        updateLike={updateLike}
        deleteBlog={deleteBlog}
      />
    )
  })

  test('at start the url & likes are not displayed', () => {
    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent2')
    expect(div).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the event handler..is called twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(updateLike.mock.calls).toHaveLength(2)
  })
  /*
  test('renders its children', () => {
    expect(
      component.container.querySelector('.togglableContent')
    ).toBeDefined()
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('show...')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', () => {
    const button = component.container.querySelector('button')
    fireEvent.click(button)

    const closeButton = component.container.querySelector(
      'button:nth-child(2)'
    )
    fireEvent.click(closeButton)

    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('toggled content can be closed', () => {
    const button = component.getByText('show...')
    fireEvent.click(button)

    const closeButton = component.getByText('cancel')
    fireEvent.click(closeButton)

    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
  */
})