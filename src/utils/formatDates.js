module.exports = {
    replyDate(date) {
        var dateObj = new Date(date)
    
        var day = dateObj.getDate()
        var month = dateObj.getMonth() + 1
        var year = dateObj.getFullYear() % 100;
        var hours = dateObj.getHours()
        var minutes = dateObj.getMinutes()
    
        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }
        if (hours < 10) {
            hours = '0' + hours
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
    
        return day + '/' + month + '/' + year + ' às ' + hours + ':' + minutes;
    }
}