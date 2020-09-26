const path = require('path')
const express = require('express')
const http = require('http')
const Filter = require('bad-words')
const socketIO = require('socket.io')

const { generateMsg, generateUrl } = require('../src/utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const PORT = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('connected!')

    socket.emit('message', generateMsg('Welcome!'))
    socket.broadcast.emit('message', generateMsg('New User has joined!'))

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.emit('message', generateMsg(message))

        callback()
    })

    socket.on('sendlocation', (coords,callback) => {
        io.emit('locationMsg', generateUrl(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMsg('User has left the chat!'))
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
