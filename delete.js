const MongoClient = require('mongodb').MongoClient
const { send, json } = require('micro')
const GitHub = require('github-api')

module.exports = async (req, res) => {
  const pwd = process.env.MONGOPWD
  const uri = `mongodb+srv://script-8-read-write:${pwd}@script-8-tr3jx.mongodb.net/script-8?retryWrites=true`
  const txt = await json(req)
  const { gist, token, isPrivate } = txt

  const gh = new GitHub({ token })

  gh.getUser()
    .getProfile()
    .then(
      response => response.data,
      error => {
        console.error({ error })
        send(res, 500, 'Error connecting to the database.')
      }
    )
    .then(userProfile => {
      const userProfileLogin = userProfile.login || ''
      MongoClient.connect(uri, (err, client) => {
        if (err) {
          console.log({ err })
          send(res, 500, 'Error connecting to the database.')
        } else {
          const db = client.db('script-8')
          const collection = db.collection('shelf')

          collection.deleteOne(
            { gist, user: userProfileLogin },
            (error, result) => {
              if (!error) {
                send(res, 200, result)
                client.close()
              } else {
                console.log({ error })
                send(res, 500, 'Error deleting the cassette.')
                client.close()
              }
            }
          )
        }
      })
    })
}
