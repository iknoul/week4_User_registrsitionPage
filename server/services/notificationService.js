const schedule = require('node-schedule')
const whatsapp = require('../utils/whatsapp')

exports.scheduleNotification = (data) => {
  const { numberArray, message, date} = data

  let to = ''
  numberArray.forEach(element => {
    to += `${element}, `
  })
 
  let b = schedule.scheduleJob(new Date(date), () => {
    whatsapp.sendMsg(to, message)
    console.log('Scheduled job executed at:', new Date())
  })
  return b
}
