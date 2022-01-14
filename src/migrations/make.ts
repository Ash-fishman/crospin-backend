import * as fs from 'fs'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

const main = async (name) => {
  const fileName = getFileName(name)
  await writeFile(`migrations/${fileName}.js`, 'module.exports = require("knex-migrate-sql-file")();')
  await writeFile(`migrations/${fileName}.up.sql`, '')
  await writeFile(`migrations/${fileName}.down.sql`, '')
  console.log('Created Migration', fileName)
}

const getFileName = (name) => {
  const format = (n) => n.toString().padStart(2, '0')
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = format(now.getMonth() + 1)
  const dd = format(now.getDate())
  const hh = format(now.getHours())
  const MM = format(now.getMinutes())
  const ss = format(now.getSeconds())
  return `${yyyy}${mm}${dd}${hh}${MM}${ss}_${name}`
}

main(process.argv[2])
