const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#messageform').addEventListener('submit', (e)=>{
    e.preventDefault()

    const message = e.target.elements.value
    socket.emit('sendMessage', message, (error) => {
        if(error){
            console.log(error)
        }
        console.log('Message delivered!')
    })
})

document.querySelector('#sendlocation').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendlocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, () => {
            console.log('Location Shared!')
        })
    })
})