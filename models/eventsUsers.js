const{Schema,model} = require('mongoose')
const connTab = new Schema({
    userId:{
        type: String,        
    },
    eventId:{
        type: String,        
    }
})
module.exports=model('eventsUsers',connTab)