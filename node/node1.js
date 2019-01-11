console.log(__dirname)
// console.log(__filename)
const index = __filename.lastIndexOf('\\') + 1
const fileName = __filename.substring(index)
console.log(fileName)
