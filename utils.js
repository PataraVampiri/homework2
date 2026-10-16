
const fs = require('fs/promises')

async function readFile(filePath, isParse = false) {
    const readData = await fs.readFile(filePath, 'utf-8')
    return isParse ? JSON.parse(readData) : readData
}

async function writeFile(filePath, data) {
    const writeData = typeof data === 'string'
        ? data
        : JSON.stringify(data)

    await fs.writeFile(filePath, writeData)
}

module.exports = {
    readFile,
    writeFile
}
