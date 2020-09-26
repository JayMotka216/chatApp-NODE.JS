const path = require('path')
const express = require('express')
const http = require('http')
const Filter = require('bad-words')
const socketIO = require('socket.io')

const { generateMsg, generateUrl } = require('../src/utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('../src/utils/user')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const PORT = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('connected!')

    socket.on('join', ( options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if(error){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', generateMsg('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMsg('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message', generateMsg(user.username, message))

        callback()
    })

    socket.on('sendlocation', (coords,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMsg', generateUrl(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMsg(`${user.username} has left the chat!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
