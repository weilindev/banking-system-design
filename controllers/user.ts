import express from 'express'
import { randomUUID } from 'crypto'

import UserService from '../service/user'

export interface IAccount {
	aid: string
	name: string
	balance: number
	lastOperateAt: Date
	createdAt: Date
	updatedAt: Date
}

const UserController = {
	// TODO: login & authentication
	async login(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		res.send('login')
	},
	async register(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		const userName = req.body.name as string
		const newUser: IAccount = {
			aid: randomUUID(),
			name: userName,
			balance: 0,
			lastOperateAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		// save record
		const content = UserService.create(newUser)
		
		res.status(200).send({ success: true, data: { content }})
	}
}

export default UserController;