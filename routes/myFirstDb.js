const {Router, response}= require('express')
const Events=require('../models/events.js')
const Auth=require('../models/auth.js')
const EventsUsers=require('../models/eventsUsers.js')
const router=Router()
const controller = require('../authController.js')
const {check} = require('express-validator')
var ht="fjjgkk";
const roleMiddleware = require('../middleware/roleMiddleWare.js')
const authMiddleware = require('../middleware/authMiddleWare.js')
const jwt = require('jsonwebtoken');
const events = require('../models/events.js')
const { $where } = require('../models/events.js')
const { enable } = require('express/lib/application')

//Name - ЭТО ID
//ID - ЭТО NAME

router.get('/',async(req,res)=>{
    const events=await Events.find({}).lean()
    for(let i=0;i<events.length;i++){
        events[i].startDate=(events[i].startDate+"").split("T")[0];
    }
    //console.log(userIds)
    res.render('index',{
        events,
    })
})

router.post('/register', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 6 символов").isLength({min:6})
], controller.register)


router.get('/register',async(req,res)=>{
    var isRegister=true
    res.render('register',{isRegister})
})

router.get('/check',async(req,res)=>{
    const events=await Events.find({}).lean()
    res.render('check',{events})
})

router.post('/login', controller.login)


router.get('/login',async(req,res)=>{
    var isLogin = true
    res.render('login',{isLogin})
})

router.get('/users', roleMiddleware(["USER"]), controller.getUsers)


router.post('/', async(req,res)=>{    
    console.log("everethyng works")   
        const auth =new Auth({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
        
        await auth.save()
        res.redirect('/')      
    })

    router.get('/create',async(req,res)=>{
        var userData = jwt.decode(global.token);
        var isAdmin=false;
        if(userData.roles.length==2) isAdmin=true;
        const events=await Events.find({}).lean()
        var userName = userData.name
        var userIds = userData.id
        var isCreate=true;
        var User=true;
       
        //console.log(userIds)
        res.render('create',{
            events,
            userName,
            userIds,
            isCreate,
            isAdmin,
            User
        })
    })
    
    router.post('/create', async(req,res)=>{ 
        console.log(req.body.startDate);   
     
            var events =new Events({
                name:req.body.eventname,
                game:req.body.game,
                types:req.body.types,
                startDate:req.body.startDate.split('T')[0],
                startTime:req.body.startTime,
                participants: 1,
                maxParticipants:req.body.maxParticipants,
                description:req.body.description,
                userId:req.body.action,
                users:{userName : req.body.userNamee, rating:0}

            }) 
            
            await events.save()
            res.redirect('/create')      
        })
        
       router.get('/events',async(req,res)=>{
    var userData = jwt.decode(global.token);
    var isAdmin=false;
    var User=true;
    if(userData.roles.length==2) isAdmin=true;
    const events=await Events.find({}).lean()
    for(let i=0;i<events.length;i++){
        events[i].startDate=(events[i].startDate+"").split("T")[0];
    }
    var userName = userData.name
    var userIds = userData.id
    var isEvents= true
    //console.log(userIds)
    res.render('events',{
        isAdmin,
        events,
        userName,
        userIds,
        User,
        isEvents
    })
})
 
router.post('/events', async(req,res)=>{    
    console.log(req.body.mom2)
    var userData = jwt.decode(global.token);
    var userIds = userData.name
    var event = await Events.findById(req.body.mom)
    console.log(event)
    event.users.push({userName : userIds, rating:0})
    await event.participants++
    await event.save()
    res.redirect('/events')      
})


router.get('/myevents',async(req,res)=>{
    var userData = jwt.decode(global.token);
    var isAdmin=false;
    var User=true;
    if(userData.roles.length==2) isAdmin=true;
    var userName = userData.name
    var userIds = userData.id
    var myevents=new Array ();
    myevents = await Events.find( {users: { $elemMatch : { userName:userName}}}).lean()
    var isMyEvents=true;
    res.render('myevents',{
        isAdmin,
        myevents,
        userName,
        userIds,
        User,
        isMyEvents   
    })
})

router.post('/myevents', async(req,res)=>{ 
    console.log(req.body.userIdValue + ' myNumber')   
    console.log(req.body.mom[req.body.userIdValue] + ' EventId')  
    console.log(req.body.userListValue + " userName")
    console.log(req.body.userIdValue + " UsrIdVal")
    console.log("  ")

    var userrino = req.body.userListValue
    if (+req.body.isDelete == 0) {
        await Events.findByIdAndUpdate(req.body.mom[req.body.userIdValue], {$pull: {users: {userName:userrino, rating: 0}}})  
    }
    else {
        await Events.findByIdAndDelete(req.body.selectedUser)
    }
    res.redirect('/myevents')      
})




router.post('/admin_events', async(req,res)=>{ 
    console.log(req.body.userIdValue + ' myNumber')   
    console.log(req.body.mom[req.body.userIdValue] + ' EventId')  
    console.log(req.body.userListValue + " userName")
    console.log(req.body.userIdValue + " UsrIdVal")
    console.log("  ")
    var userrino = req.body.userListValue

    if (+req.body.isDelete == 0) {
        await Events.findByIdAndUpdate(req.body.mom[req.body.userIdValue], {$pull: {users: {userName:userrino, rating: 0}}})  
    }
    else {
        await Events.findByIdAndDelete(req.body.selectedUser)
    }
    
    res.redirect('/admin_events')      
})



router.get('/admin_events',async(req,res)=>{
    var userData = jwt.decode(global.token);
    var isAdmin=false;
    var User=true;
    if(userData.roles.length==2) isAdmin=true;
    var userName = userData.name
    var userIds = userData.id
    var isAdminEvent = true
    const events=await Events.find().lean()

    res.render('admin_events',{
        isAdmin,
        events,
        userName,
        userIds,
        User,
        isAdminEvent
    })
})



router.get('/admin_users',async(req,res)=>{
    var userData = jwt.decode(global.token);
    var isAdmin=false;
    var User=true;
    if(userData.roles.length==2) isAdmin=true;
    var userName = userData.name
    var userIds = userData.id
    const users=await Auth.find().lean()
    var isAdminUser = true

    res.render('admin_users',{
        users,
        userName,
        userIds,
        isAdmin,
        User,
        isAdminUser
    })
})

router.post('/admin_users', async(req,res)=>{ 
    await Events.updateMany({}, {$pull: {users: {userName:req.body.mom2, rating: 0}}})
    await Auth.findByIdAndDelete(req.body.mom)
    res.redirect('/admin_users')      
})


module.exports=router