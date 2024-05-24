const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { getReminderDate } = require('./services/gemini');
const { formatDate } = require('./utils/formatDate');
const { addOne } = require('./database/database');
const { startClock } = require('./services/clock');

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

client.initialize();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('🔥');
    startClock(client)
});

client.on('message_create', async message => {
    if(!message.fromMe){
        let currentDateFormated = new Date().toString()

        let reminder = await getReminderDate({
            "label": message.body,
            "currentDate": currentDateFormated
        })

        if(reminder){
            const newTask = {
                userPhone: message.from,
                userName: message._data.notifyName,
                label: message.body,
                reminderDate: reminder.reminderDate,
                task: reminder.task
            }

            console.log(newTask)
                    
            addOne(newTask)
                .then((status) => {
                    if(status){
                        message.reply(`Você será lembrado(a) em:\n${formatDate(reminder.reminderDate)}`)
                    }
                })
                .catch(() => {
                    message.reply(`Não foi possível salvar a tarefa`)
                })
        }
    }
});