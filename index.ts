import express from 'express'
import http from 'http'
import fs from 'fs-extra'
import path from 'path'
import 'dotenv/config'

import apiUserRoutes from './routes/user'

const app: express.Express = express()
const port: number = 8100

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// initialize data folder/file
const targetDir = path.resolve(__dirname, './localstorage')
if (!fs.existsSync(targetDir)) {
	fs.mkdirSync(targetDir)
	fs.writeFileSync(path.join(targetDir, 'account.json'), JSON.stringify([]), 'utf8')
	fs.writeFileSync(path.join(targetDir, 'transaction.json'), JSON.stringify([]), 'utf8')
}

app.use('/api/user', [], apiUserRoutes)

const httpserver = new http.Server(app)

httpserver.listen(port, () => {
	console.log(`Express and socket server listening on port ${port}`)
})
