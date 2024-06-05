const { deleteAll } = require("../database");

async function main(){
    const data = await deleteAll()
    
    if(data){
        console.log('success')
    }
}

main()