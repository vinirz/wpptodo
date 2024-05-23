const fastify = require('fastify')
const { connect } = require('../routes/connect')

const app = fastify()

app.register(connect)

app.listen({ port: 3000 }).then(() => {
    console.log('fastify running')
})