const MongoClient = require('mongodb').MongoClient
const { send } = require('micro')
const { parse } = require('url')

module.exports = async (req, res) => {
  const pwd = process.env.MONGOPWD
  const uri = `mongodb+srv://script-8-read-write:${pwd}@script-8-tr3jx.mongodb.net/script-8?retryWrites=true`

  const { query } = parse(req.url, true)
  const { gist } = query

  MongoClient.connect(uri, (err, client) => {
    if (err) {
      console.log({ err })
      send(res, 500, 'Error connecting to the database.')
    } else {
      const db = client.db('script-8')
      const collection = db.collection('shelf')

      const date = new Date()
      const dateString = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ].join('-')
      const visitsDate = `visits.${dateString}`

      collection.updateOne(
        { gist },
        { $inc: { [visitsDate]: 1 } },
        (error, result) => {
          if (!error) {
            send(res, 200, result)
            client.close()
          } else {
            console.log({ error })
            send(res, 500, 'Error updating the counter for a cassette.')
            client.close()
          }
        }
      )
    }
  })
}
