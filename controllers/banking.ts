import express from 'express'

import UserService from '../service/user'
import LogService from '../service/log'
import { randomUUID } from 'crypto'

const BankingController = {
	async checkBalance(
		req: express.Request,
		res: express.Response,
	): Promise<express.Response<any, Record<string, any>>> {
		const accountId = req.params.aid as string
		const account = UserService.getTarget(accountId)
		if (!account) {
			return res.status(400).send({ success: false, message: 'account not found.'})
		}
		return res.status(200).send({ success: true, data: { balance: account.balance } })
	},
	async deposit(
		req: express.Request,
		res: express.Response
	): Promise<express.Response<any, Record<string, any>>> {
		const accountId = req.body.aid as string
		const depositAmount = req.body.amount as number
		if (depositAmount <= 0) {
			return res.status(400).send({ success: false, message: 'amount cannot be zero or negative.'})
		}
		const account = UserService.getTarget(accountId)
		if (!account) {
			return res.status(400).send({ success: false, message: 'account not found.'})
		}

		const updatedPayload = {
			...account,
			balance: account.balance + depositAmount,
			lastOperateAt: new Date(),
			updatedAt: new Date(),
		}
		// update record
		const content = UserService.update(updatedPayload)

		return res.status(200).send({ success: true, data: { content } })
	},
	async withdraw(
		req: express.Request,
		res: express.Response
	): Promise<express.Response<any, Record<string, any>>> {
		const accountId = req.body.aid as string
		const withdrawAmount = req.body.amount as number
		if (withdrawAmount <= 0) {
			return res.status(400).send({ success: false, message: 'amount cannot be zero or negative.'})
		}
		const account = UserService.getTarget(accountId)
		if (!account) {
			return res.status(400).send({ success: false, message: 'account not found.'})
		}
		if (account.balance < withdrawAmount) {
			return res.status(400).send({ success: false, message: 'balance not enough.'})
		}

		const updatedPayload = {
			...account,
			balance: account.balance - withdrawAmount,
			lastOperateAt: new Date(),
			updatedAt: new Date(),
		}
		// update record
		const content = UserService.update(updatedPayload)

		return res.status(200).send({ success: true, data: { content } })
	},
	async transfer(
		req: express.Request,
		res: express.Response
	): Promise<express.Response<any, Record<string, any>>> {
		const fromAccountId = req.body.from as string
		const toAccountId = req.body.to as string
		const transferAmount = req.body.amount as number
		if (transferAmount <= 0) {
			return res.status(400).send({ success: false, message: 'amount cannot be zero or negative.'})
		}
		const fromAccount = UserService.getTarget(fromAccountId)
		const toAccount = UserService.getTarget(toAccountId)
		if (!fromAccount || !toAccount) {
			return res.status(400).send({ success: false, message: 'account not found.'})
		}
		if (fromAccount.balance < transferAmount) {
			return res.status(400).send({ success: false, message: 'balance not enough.'})
		}

		// from account update
		const updatedFromPayload = {
			...fromAccount,
			balance: fromAccount.balance - transferAmount,
			lastOperateAt: new Date(),
			updatedAt: new Date(),
		}
		// to account update
		const updatedToPayload = {
			...toAccount,
			balance: toAccount.balance + transferAmount,
			lastOperateAt: new Date(),
			updatedAt: new Date(),
		}
		// update record
		const fromContent = UserService.update(updatedFromPayload)
		const toContent = UserService.update(updatedToPayload)

		// create transfer log
		LogService.transfer({
			tid: randomUUID(),
			type: 'transfer',
			amount: transferAmount,
			operator: fromAccountId,
			receiver: toAccountId,
			success: true,
			createdAt: new Date(),
		})

		return res.status(200).send({ success: true, data: { content: [fromContent, toContent] } })
	}
}

export default BankingController;