import fs from 'fs-extra'
import path from 'path'

import { IAccount } from '../controllers/user'

const TARGETFILENAME = path.resolve(__dirname, '../localstorage/account.json')

const UserService = {
	create(newContent: Record<string, any>) {
		const content = JSON.parse(fs.readFileSync(TARGETFILENAME, 'utf8'))
		content.push(newContent)
		fs.writeFileSync(TARGETFILENAME, JSON.stringify(content), 'utf8')
		return newContent
	},
	getTarget(id: string) {
		const accountList = JSON.parse(fs.readFileSync(TARGETFILENAME, 'utf8'))
		const targetUser = accountList.find((user: IAccount) => user.aid === id)
		if (!targetUser) return null
		return targetUser
	}
}

export default UserService