import express from 'express'
import axios from 'axios'
import redis from 'redis'
const app = express()
const PORT = process.env.PORT || 9000
const REDIS = process.env.REDIS1
const REDIS_PORT = process.env.REDIS_PORT || 6379
// const client = redis.createClient(REDIS_PORT)  // 왜 그런지 옆문장은 createClient('tcp://172.17.0.2:6379')로 실행되서 node에서 tcp protocol을 사용한다고 warning message를 낸다.
const client = redis.createClient({url:REDIS})

client.on('connect', () => console.log(`Redis is connected on port ${REDIS_PORT}`))
client.on("error", (error) => console.error(error))

await client.connect();

app.get('/api/v1/users/:username', async (req, res) => {
  try {
    const username = req.params.username
    const cache_data = await client.GET(username)
    if (cache_data) {
      return res.status(200).send({
        message: `Retrieved ${username}'s data from the cache`,
        users: JSON.parse(cache_data)
      })
    } else {
      const api = await axios.get(`https://jsonplaceholder.typicode.com/users/?username=${username}`)
      await client.SETEX(username, 1440, JSON.stringify(api.data))
      return res.status(200).send({
        message: `Retrieved ${username}'s data from the server`,
        users: api.data
      })
    }
  } catch (error) {
    console.log(error)
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


