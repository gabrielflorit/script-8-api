const { send } = require('micro')
const Gists = require('gists')
const { parse } = require('url')

module.exports = (req, res) => {
  const { query } = parse(req.url, true)
  const { id } = query

  const gists = new Gists({
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  })

  gists
    .get(id)
    .then(gist => {
      send(res, 200, gist.body)
    })
    .catch(error => {
      console.log({ id, error })
      send(res, 500, 'Error retrieving the gist.')
    })
}
