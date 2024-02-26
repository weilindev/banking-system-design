import express from 'express'
import BankingController from '../controllers/banking'

const router: express.Router = express.Router()

router.get('/check/:aid', BankingController.checkBalance)

router.post('/deposit', BankingController.deposit)

router.post('/withdraw', BankingController.withdraw)

router.post('/transfer', BankingController.transfer)

export default router