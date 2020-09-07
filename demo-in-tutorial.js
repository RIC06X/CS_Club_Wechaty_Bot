const qrTerm = require('qrcode-terminal')

const { 
  Wechaty, 
  Room 
} = require('wechaty')

const bot = new Wechaty({profile: 'Hiname3'})

const ussr_jokes = [
  '斯大林去看一场苏联喜剧电影的首映禮。在影片播放时他一直快活地大笑，不过在电影结束之时他突然问道：\“好吧，我喜欢这电影。可为什么那个丑角的小胡子和我的一样？”所有人都噤若寒蝉，只有一人怯怯地提议道：“斯大林同志，要不要让演员把胡子剃了？”斯大林答道：“好主意，枪毙前先把胡子剃了"',
  '有人给克里姆林宫打电话：“你们现在在找苏共的新总书记吗？”“不！你是谁？傻瓜吗？”“对，病入膏肓的老傻瓜！'
]

bot.on('scan',    function (qrcode, status) {
  qrTerm.generate(qrcode, { small: true })
})

bot.on('login',   function (user) {
  console.log(`${user} login`)
})

bot.on('logout',  function (user) {
  console.log(`${user} logout`)
})

bot.on('friendship', async function (friendship) {
  console.log(`get FRIENDSHIP event!`)

  switch (friendship.type()) {
    case this.Friendship.Type.Receive:
      await friendship.accept()
      console.log(`accept friendship!`)
      break
    case this.Friendship.Type.Confirm:
      friendship.contact().say(`Nice to meet you~`)
      break
  }
})

bot.on('message', async function (msg) {
  const contact = msg.from()
  const text = msg.text()
  const room = msg.room()

  if (msg.self()) {
    return
  }

  if (room) {
    const topic = await room.topic()
    console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
  } else {
    console.log(`Contact: ${contact.name()} Text: ${text}`)
  }

  if (/Hello/.test(text)) {
    msg.say('Welcome to wechaty, I am wechaty bot RUI!')
  }

  if (/room/.test(text)) {
    const keyroom = await bot.Room.find({topic: 'wechaty test room'})

    if (keyroom) {
      const topic = await keyroom.topic()
      await keyroom.add(contact)
      await keyroom.say(`Welcome to join ${topic}`, contact)
    }
  }

  if (/fword/.test(text)) {
    let keyroom = await bot.Room.find({topic: 'wechaty test room'})

    if (keyroom) {
      await keyroom.say('You said fword, I will remove from the room', contact)
      await keyroom.del(contact)
    }
  }

  if (/ussr/.test(text)){
    let keyroom = await bot.Room.find({topic: 'wechaty test room'})
    if (keyroom){
      await keyroom.say(ussr_jokes[Math.floor(Math.random()*ussr_jokes.length)], contact)
    }
  }

})

bot.start()
.catch(console.error)

