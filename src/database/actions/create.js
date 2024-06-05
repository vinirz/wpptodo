const { addOne } = require("../database");

async function main(task){
    const data = await addOne(task)

    if(data){
        console.log('success')
    }
}

main({
    userPhone: "553291436256@c.us",
    userName: "Vinicius",
    label: "Comprar frutas",
    reminderDate: "31/05/2024, 12:00",
    task: "Não esqueça as frutas"
})

main({
    userPhone: "553291436256@c.us",
    userName: "Vinicius",
    label: "Ir no dentista",
    reminderDate: "01/06/2024, 12:00",
    task: "Cuide da sua saúde"
})
