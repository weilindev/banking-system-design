import express from 'express'
import http from 'http'

const app: express.Express = express()
const port: number = 8100

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.get('/api/testing', (req, res) => {
	res.send('Hello World!')
})

const httpserver = new http.Server(app)

httpserver.listen(port, () => {
	console.log(`Express and socket server listening on port ${port}`)
})
