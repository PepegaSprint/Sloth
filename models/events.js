const{Schema,model} = require('mongoose')
const eventsTab = new Schema({
    name:{
        type: String,
        required: true,
    },
    game:String,
    types:String,
    startDate: String,
    startTime: String,
    participants:Number,
    maxParticipants:Number,
    description:String,
    userId:String,
    users:{
        type:[
        {userName: {
            type:String,
        },
        rating: Number,}          
        ],
    }
    
})
module.exports=model('events',eventsTab)

