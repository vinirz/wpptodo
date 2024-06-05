const { deleteOne } = require("../database");

async function main(){
    const data = await deleteOne('01/06/2024, 12:00')
    
    if(data){
        console.log('success')
    }
}

main()