
const client = mqtt.connect('ws://iotCore.lat:8083/mqtt', {
  connectTimeout: 4000,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  keepalive: 60,
  clean: true,
})

client.on('connect', () => {
  console.log('Connect success')
  client.subscribe(
    'chat/#', 
    { qos: 0 }, 
    (error) => (console.log(!error? "suscribe" :"Don´t subscribe"))
  )
})

client.on('reconnect', (error) => {
  console.log('Reconnecting:', error)
})

client.on('error', (error) => {
  console.log('Connect Error:', error)
})


const $username = document.querySelector('#username')
$username.value = 'User' + Math.floor(Math.random() * 10000)
const $chatHistory = document.querySelector('#chatHistory')

const wrapperHTML = (username, message) => {
  return `<div class="px-2 py-1 w-fit rounded-sm ${username == $username.value? 'self-end bg-blue-200' : 'bg-green-200'}">
    <div class="text-sm">${username}</div>
    <div class="">${message}</div>
  </div>`
}

client.on('message', ( topic, message) => {
  if(topic === 'chat') {
    const data = JSON.parse(message.toString())
    
    $chatHistory.insertAdjacentHTML('afterbegin', wrapperHTML(data.username, data.message));
  }
})


const sendMessage = (ev) => {
  const message = ev.target.value;
  if(!message) return
  if(!$username.value) {
    alert('Please enter your username')
    return
  }

  const to_send = {
    username: $username.value,
    message
  }

  client.publish(
    'chat',
    JSON.stringify(to_send),
    { qos: 0, retain: false },
  )
  ev.target.value = ''
}