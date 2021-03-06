const socket = io()

const $msgForm = document.querySelector('#messageform')
const $msgFormInput = $msgForm.querySelector('input')
const $msgFormBtn = $msgForm.querySelector('button')
const $sendlocation = document.querySelector('#sendlocation')
const $messages = document.querySelector('#messages')

const msgTemp = document.querySelector('#msg-temp').innerHTML
const urlTemp = document.querySelector('#url-temp').innerHTML
const sideTemp = document.querySelector('#users-temp').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //New message heigth
    const $newMsg = $messages.lastElementChild
    //Height of new message
    const newMsgStyle = getComputedStyle($newMsg)
    const newMsgMargin = parseInt(newMsgStyle.marginBottom)
    const newMsgHeight = $newMsg.offsetHeight + newMsgMargin
    //Visible height
    const visibleHeigth = $messages.offsetHeight
    //Height of messages container
    const contHeight = $messages.scrollHeight
    //How far scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeigth

    if(contHeight - newMsgHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(msgTemp, {
        username : message.username,
        message : message.text,
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMsg', (url) => {
    console.log(url)
    const html = Mustache.render(urlTemp, {
        username : url.username,
        message : url.url,
        createdAt : moment(url.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users}) => {
    const html = Mustache.render(sideTemp, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$msgForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    $msgFormBtn.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $msgFormBtn.removeAttribute('disabled','disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()
        
        if(error){
            console.log(error)
        }
        console.log('Message delivered!')
    })
})

$sendlocation.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.')
    }

    $sendlocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendlocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, () => {
            console.log('Location Shared!')
            $sendlocation.removeAttribute('disabled','disabled')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})