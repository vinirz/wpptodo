module.exports = {
    processMessage(api, opt, done){
        api.get('/process_message', opt, async(req, res) => {
            res.send('teste')
        });

        done()
    }
}