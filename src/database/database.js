const { default: axios, all } = require('axios');
const { MD5 } = require('crypto-js');

const riak = axios.create({
    baseURL: "http://localhost:8098/",
    timeout: 15000,
});

module.exports = {
    async addOne(data){
        const key = MD5(data.reminderDate).toString()

        try {
            const keyExists = await riak.get(`/riak/cluster/${key}`)

            if(keyExists.status === 200){
                const response = await riak.post(`/riak/cluster/${key}`, [
                    ...keyExists.data,
                    data
                ])
        
                if(response.status != 204){
                    return new Error(response.statusText)
                }
        
                return true
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {

                const response = await riak.post(`/riak/cluster/${key}`, [data])
        
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
            const response = await riak.get(`/riak/cluster/${MD5(key).toString()}`)
            return response.data
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return false;
            } else {
                throw error; 
            }
        }
    },

    async getAll(){
        const response = await riak.get(`/buckets/cluster/keys?keys=true`)

        if(response.status != 200){
            return new Error(response.statusText)
        }

        const allData = []

        for (const key of response.data.keys) {
            let value = await riak.get(`/riak/cluster/${key}`);
            allData.push({ [key]: value.data });
        }

        return allData
    },

    async deleteOne(key){
        const response = await riak.delete(`/riak/cluster/${MD5(key).toString()}`)

        if(response.status != 204){
            return new Error(response.statusText)
        }

        return true
    },

    async deleteAll(){
        const response = await riak.get(`/buckets/cluster/keys?keys=true`)

        if(response.status != 200){
            return new Error(response.statusText)
        }

        for (const key of response.data.keys) {
            try {                
                await riak.delete(`/riak/cluster/${key}`)
            } catch (error) {
                return new Error(error)
            }
        }

        return true
    }
}