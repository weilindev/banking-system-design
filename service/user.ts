import fs from 'fs-extra'
import path from 'path'

import { IAccount } from '../controllers/user'

const TARGETFILENAME = path.resolve(__dirname, '../localstorage/account.json')

const UserService = {
	create(payload: IAccount) {
		const content = JSON.parse(fs.readFileSync(TARGETFILENAME, 'utf8'))
		content.push(payload)
		fs.writeFileSync(TARGETFILENAME, JSON.stringify(content), 'utf8')
		return payload
	},
	getTarget(id: string) {
		const accountList = JSON.parse(fs.readFileSync(TARGETFILENAME, 'utf8'))
		const targetUser = accountList.find((user: IAccount) => user.aid === id)
		if (!targetUser) return null
		return targetUser
	},
	update(payload: IAccount) {
		const content = JSON.parse(fs.readFileSync(TARGETFILENAME, 'utf8'))
		const updatedIndex = content.findIndex((user: IAccount) => user.aid === payload.aid)
		content[updatedIndex] = payload
		fs.writeFileSync(TARGETFILENAME, JSON.stringify(content), 'utf8')
		return payload
	}
}

export default UserService