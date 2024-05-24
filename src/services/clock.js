const { MD5 } = require("crypto-js");
const { removeSeconds } = require("../utils/formatDate")
const { getOne, deleteOne } = require("../database/database");

module.exports = {
    startClock(client){
        setInterval(() => {
            const seconds = new Date().getSeconds()
        
            if(seconds == 0){
                const currentDate = removeSeconds(new Date().toLocaleString())
        
                console.log(`${currentDate} -> ${MD5(currentDate).toString()}`)
            
                getOne(currentDate)
                    .then(data => {
                        if(data){
                            console.log(`lembrete:\n${data.task}`)
                            client.sendMessage(data.userPhone, `${data.task}\n\nOlá *${data.userName}*\nPassando para te lembrar da sua task:\n\n_"${data.label}"_`)
                            deleteOne(currentDate)
                        }
                    })
            }
        }, 1000)
    }
}