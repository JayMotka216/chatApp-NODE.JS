const socket = io()

socket.on('updateIncrement', (count) => {
    console.log(`${count}`)
})

document.querySelector('#increment') .addEventListener('click', () => {
    console.log("clicked!")

    socket.emit('increment')
})