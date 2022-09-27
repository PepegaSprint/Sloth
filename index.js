const express  = require('express')
const mongoose = require('mongoose')
const exphbs=require('express-handlebars')
const DbRoute=require('C:/Users/User/Desktop/Sloth/routes/myFirstDb.js')
const PORT=process.env.PORT||3000
const app=express()
const path=require('path')
const authController = require('./authController')
const hbs=exphbs.create({
    defaultLayout:'main',
    extname:'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname+'/public')))
app.use(DbRoute)


async function start(){
    try{
        await mongoose.connect('mongodb+srv://Vovan:Hq7WfpP6f4GhkM4k@projectcluster.x6lxz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
          useNewUrlParser:true,
          useUnifiedTopology: true 
       })
       app.listen(PORT, ()=>{
           console.log('Server has been started')
       })
   }
   catch(e){
       console.log(e)
   }
}

start()
