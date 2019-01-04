const fs = require('fs')

// fs.writeFile('./test.txt', '\ufeffThis is an example with accents : é è à ','utf8', function (err) {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log('writeFile success')
// });

fs.writeFileSync('./test.txt', 'hahah')

// fs.readFile('./test.txt', (err,data) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log(data)
// })

console.log(fs.readFileSync(__dirname + '/test.txt').toString()) // 把buffer对象转换