const{Schema,model} = require('mongoose')
const user = new Schema({

    name:{
        type: String,
        unique :true,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required:true,
    },
    password:{
        type: String,
        required:true,
    },
    roles:[{
        type: String,
        
    }],
})
module.exports=model('user', user)