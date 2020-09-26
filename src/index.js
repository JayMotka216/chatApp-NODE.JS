const path = require('path')
const express = require('express')
const http = require('http')
const Filter = require('bad-words')
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

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message','New User has joined!')

    socket.on('sendMessage', (message, callback) => {
        const fliter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.emit('message', message)

        callback()
    })

    socket.on('sendlocation', (coords,callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has left the chat!')
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
