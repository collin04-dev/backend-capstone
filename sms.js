const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

function send(message) {
    client.messages.create({
        to: message.to,
        body: message.body,
        from: '+12153099539',
    })
}

module.exports = {
    send
}