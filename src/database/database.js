const { default: axios, all } = require('axios');
const { MD5 } = require('crypto-js');

const riak = axios.create({
    baseURL: process.env.DB_URL,
    timeout: 15000,
});

module.exports = {
    async addOne({userPhone, userName, label, reminderDate, task}){
        const key = MD5(reminderDate).toString()

        try {
            const keyExists = await riak.get(`/riak/default/${key}`)

            if(keyExists.status === 200){
                const response = await riak.post(`/riak/default/${key}`, [
                    ...keyExists.data,
                    {
                        "userPhone": userPhone,
                        "userName": userName,
                        "label": label,
                        "reminderDate": reminderDate,
                        "task": task
                    }
                ])
        
                if(response.status != 204){
                    return new Error(response.statusText)
                }
        
                return true
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {

                const response = await riak.post(`/riak/default/${key}`, [
                    {
                        "userPhone": userPhone,
                        "userName": userName,
                        "label": label,
                        "reminderDate": reminderDate,
                        "task": task
                    }
                ])
        
                if(response.status != 204){
                    return new Error(response.statusText)
                }
        
                return true

            } else {
                throw error; 
            }
        }
    },

    async getOne(key){
        try {
            const response = await riak.get(`/riak/default/${MD5(key).toString()}`)
            return response.data
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return false;
            } else {
                throw error; 
            }
        }
    },

    async deleteOne(key){
        const response = await riak.delete(`/riak/default/${MD5(key).toString()}`)

        if(response.status != 204){
            return new Error(response.statusText)
        }

        return true
    },

    async getAll(){
        const response = await riak.get(`/buckets/default/keys?keys=true`)

        if(response.status != 200){
            return new Error(response.statusText)
        }

        const allData = []

        for (const key of response.data.keys) {
            let value = await riak.get(`/riak/default/${key}`);
            allData.push({ [key]: value.data });
        }

        return allData
    },

    async deleteAll(){
        const response = await riak.get(`/buckets/default/keys?keys=true`)

        if(response.status != 200){
            return new Error(response.statusText)
        }

        for (const key of response.data.keys) {
            try {                
                await riak.delete(`/riak/default/${key}`)
            } catch (error) {
                return new Error(error)
            }
        }

        return true
    }
}