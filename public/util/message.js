const moment = require('moment')

function messageFormat(username , text){
    return {
        username ,
        text,
        time : moment().format('h:m a')
    }
}

module.exports = messageFormat;