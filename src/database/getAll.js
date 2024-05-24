const { getAll, getOne } = require("./database");

async function main(){
    const data = await getAll()
    console.log(JSON.stringify(data, null, 2))
}

main()