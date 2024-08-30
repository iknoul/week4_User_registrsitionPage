const request = require('request')

  exports.sendMsg = (to, message)=>{
    const o = "jhl"
    const options = {
    method: 'POST',
    url: 'https://api.ultramsg.com/instance86416/messages/chat',
    headers: { 'content-type': ' application/x-www-form-urlencoded' },
    form: {
      token: 'vz55ws719o9r0j4m',
      to: `+91 ${to}`,
      body: message,o
    },
    }
    request(options, function (error, response, body) {
        if (error) throw new Error(error)
    })
  }