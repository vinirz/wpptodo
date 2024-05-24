const Riak = require('basho-riak-client');
const { MD5 } = require('crypto-js');

const nodes = ['127.0.0.1:8087']

var client = new Riak.Client(nodes, (err, c) => {err ? err : c});

module.exports = {
    addOne({userPhone, userName, label, reminderDate, task}){
        return new Promise((resolve, reject) => {
            client.storeValue({
                bucket: 'default',
                key: MD5(reminderDate).toString(),
                value: {
                    "userPhone": userPhone,
                    "userName": userName,
                    "label": label,
                    "reminderDate": reminderDate,
                    "task": task
                }
            }, (err) => {
                if(err){
                    console.log(err)
                    reject(false)
                }else{
                    console.log(`saved! -> ${reminderDate} -> ${MD5(reminderDate).toString()}`)
                    resolve(true)
                }
            })
        })
    },

    getOne(key){
        return new Promise((resolve, reject) => {
            client.fetchValue({ 
                bucket: 'default', 
                key: MD5(key).toString(),
                convertToJs: true 
            }, (err, rslt) => {
                if (err) {
                    reject(err); 
                } else if (rslt.values.length > 0) {
                    const riakObj = rslt.values.shift();
                    const data = riakObj.value;
                    resolve(data); 
                } else {
                    resolve(null); 
                }
            });
        });
    },

    deleteOne(key){
        client.deleteValue({ 
            bucket: 'default', 
            key:  MD5(key).toString()
        }, (err) => {err ? err : console.log('deleted!')});
    },

    getAll(){
        client.listKeys({bucket: 'default'}, (err, data) => {
            if(err){
                return err
            }

            [data].forEach(e => {
                console.log(e.keys[0])
            })
        })
    },

    deleteAll(){
        client.listKeys({bucket: 'default'}, (err, data) => {
            if(err){
                return err
            }

            [data].forEach(e => {
                if(e.keys[0]){
                    client.deleteValue({ bucket: 'default', key: e.keys[0] }, () => {});
                }
            })

            console.log('deleted')
        })
    }
}

// '553291436256@c.us', 'Vinicius Reis', 'comprar maçã amnhã às 8:00', '31/05/2024, 12:00:00', 'Comprar presente para josicleiton'