const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { getReminderDate } = require('./gemini');
const { replyDate } = require('./formatDates');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "./auth"
    }),
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.initialize();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async message => {
    if(!message.fromMe){
        let currentDateFormated = new Date(message.timestamp * 1000).toISOString().split('.')[0]

        let reminderDate = await getReminderDate({
            "label": message.body,
            "currentDate": currentDateFormated
        })

        if(reminderDate){
            const newTask = {
                userPhone: message.from,
                userName: message._data.notifyName,
                label: message.body,
                currentDate: currentDateFormated,
                reminderDate: reminderDate
            }
        
            console.log(newTask)
            message.reply(`Você será lembrado em:\n${replyDate(reminderDate)}`)
        }

    }
});