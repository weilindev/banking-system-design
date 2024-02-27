import express from 'express'
import UserController from '../controllers/user'

const router: express.Router = express.Router()

router.post('/register', UserController.register)

export default router