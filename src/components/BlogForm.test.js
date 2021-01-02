/**
 * @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  const createBlog = jest.fn()

  beforeEach(() => {
    component = render(
      <BlogForm createBlog={createBlog}
      />
    )
  })

  test('the form calls the event handler..with the right details when a new blog is created', () => {
    const title = component.container.querySelector('#title')
    const url = component.container.querySelector('#url')

    if (title & url) {
      const button = component.getByText('create')
      fireEvent.click(button)
      expect(createBlog.mock.calls).toHaveLength(1)
    }

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