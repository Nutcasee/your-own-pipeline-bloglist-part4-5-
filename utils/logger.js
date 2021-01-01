const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    /* eslint-disable no-alert, no-console */
    console.log(...params)
  }
}

const error = (...params) => {
  /* eslint-disable no-alert, no-console */
  console.error(...params)
}

module.exports = {
  info, error
}
