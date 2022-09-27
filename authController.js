const user = require('./models/auth.js');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require("./config");
const { redirect } = require('express/lib/response');



const generateAccessToken = (id,name, roles) => {
    const payload = {
        id,
        name,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}


class authController {
    
    async register(req,res){
try {
    const errors = validationResult(req)
    if (!errors.isEmpty)
    {
        return res.status(400)}
    const {name,email,password} = req.body
    const candidateNm = await user.findOne({name})
    if (candidateNm) {
        return res.status(400).json({message: "Пользователь с таким именем уже существует"})
    }
    const candidateEm = await user.findOne({email})
    if (candidateEm) {
        return res.status(400).json({message: "Пользователь с таким адресом уже существует"})
    }
    var hashpass = bcrypt.hashSync(password, 10);
    const userRole = "USER"
    const userNew = new user({name, email, password: hashpass, roles : userRole})
    await userNew.save()
    const usernm = await user.findOne({name})
    const token = generateAccessToken(usernm._id, usernm.name, usernm.roles)
    global.token=token
    var userData = jwt.decode(global.token);
    console.log(userData)
    res.redirect('/events')
} catch (error) {
    console.log(error)
    res.status(400)
    
}
 }

 async login(req, res) {
    try {
        const {name, password} = req.body
        const usernm = await user.findOne({name})
        if (!usernm) {
            return res.status(400).json({message: `Пользователь ${name} не найден`})
        }
        const validPassword = bcrypt.compareSync(password, usernm.password)
        if (!validPassword) {
            return res.status(400).json({message: `Введен неверный пароль`})
        }
        //localStorage.clear()
        
        const token = generateAccessToken(usernm._id, usernm.name, usernm.roles)
        //let storageToken = {'token' : token}
       // window.localStorage.setItem('session', toString(storageToken))
       // var decoded = jwt.decode(token, {complete: true});
        global.token=token
        //console.log(global.token)
        res.redirect('/myevents')
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Login error'})
    }
}
        
async getUsers(req, res) {
    try {
        const users = await user.find()
        res.json(users)
    } catch (e) {
        console.log(e)
    }
}


//async getRoles(req, res) {
//    try {
//        const newusr = new role()
//        const newusr2 = new role({value: "ADMIN"})
//        const newusr3 = new role({value: "ADMIN"})
//        await newusr.save()
//        await newusr2.save()
//        await newusr3.save()
//        res.json(users)
//    } catch (e) {
//        console.log(e)
//    }
//}

}

module.exports = new authController()