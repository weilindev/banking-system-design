import fs from 'fs-extra'
import path from 'path'

const TARGETFILENAME = path.resolve(__dirname, '../localstorage/transaction.json')

const LogService = {
	transfer(payload: any) {
		const content = JSON.parse(fs.readFileSync(TARGETFILENAME, 'utf8'))
		content.push(payload)
		return fs.writeFileSync(TARGETFILENAME, JSON.stringify(content), 'utf8')
	}
}

export default LogService