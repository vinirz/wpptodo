const { addOne } = require("./database");

async function main(){
    const data = await addOne({
        userPhone: "553291436256@c.us",
        userName: "Vinicius",
        label: "apenas testando 21",
        reminderDate: "31/05/2024, 12:00",
        task: "olá 22"
    })
    console.log(data)
}

main()