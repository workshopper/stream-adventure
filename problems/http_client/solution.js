const { request } = require('http')

const options = { method: 'POST' }
const req = request('http://localhost:8099', options, (res) => {
  res.pipe(process.stdout)
})
process.stdin.pipe(req)
