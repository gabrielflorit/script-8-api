const MongoClient = require('mongodb').MongoClient
const { send, json } = require('micro')

module.exports = async (req, res) => {
  const pwd = process.env.MONGOPWD
  const uri = `mongodb+srv://script-8-read-write:${pwd}@script-8-tr3jx.mongodb.net/script-8?retryWrites=true`
  const txt = await json(req)
  const { user, gist, cover, title } = txt

  MongoClient.connect(
    uri,
    (err, client) => {
      if (err) {
        console.log({ err })
        send(res, 500, 'Error connecting to the database.')
      } else {
        const db = client.db('script-8')
        const collection = db.collection('shelf')

        collection.update(
          { gist },
          { user, gist, cover, title, updated: Date.now() },
          { upsert: true },
          (error, result) => {
            if (!error) {
              send(res, 200, result)
            } else {
              console.log({ error })
              send(res, 500, 'Error updating the cassettes collection.')
            }
          }
        )
      }
    }
  )
}
