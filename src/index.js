const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const PORT = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log('connected!')

    socket.emit('updateIncrement', count)

    socket.on('increment', () => {
        count++
        //socket.emit('updateIncrement', count)
        io.emit('updateIncrement',count)
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
