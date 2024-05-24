const { MD5 } = require("crypto-js");
const { removeSeconds } = require("../utils/formatDate")
const { getOne, deleteOne } = require("../database/database");

module.exports = {
    startClock(client){
        setInterval(async () => {
            const seconds = new Date().getSeconds()
        
            if(seconds == 0){
                const currentDate = removeSeconds(new Date().toLocaleString())
        
                console.log(`${currentDate} -> ${MD5(currentDate).toString()}`)
                
                const reminder = await getOne(currentDate)

                if(reminder){
                    for (const task of reminder) {
                        client.sendMessage(task.userPhone, `${task.task}\n\nOlá *${task.userName}*\nPassando para te lembrar da sua task:\n\n_"${task.label}"_`)
                    }
                    deleteOne(currentDate)
                }
            }
        }, 1000)
    }
}