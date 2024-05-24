const { deleteAll, deleteOne } = require("./database");

async function main(){
    const data = await deleteAll()
    console.log(data)
}

main()