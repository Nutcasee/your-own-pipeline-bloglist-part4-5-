import React from 'react'

const Notification = ({ notification }) => {
  console.log('notification ', notification)
  if (notification === null) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

export default Notification