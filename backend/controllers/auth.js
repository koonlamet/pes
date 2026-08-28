const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req,res) =>{
    try {
        const {username,password,fname,role='evaluatee',status='newbie'}  = req.body;
        const result = await db('user').where({username:username});
        if(result.length>0){
            return res.status(400).json({
                success:false,
                message:"Username นี้มีผู้ใช้แล้ว"
            })
        }
        const passHash = await bcrypt.hash(password,10);
        const [createUser] = await db('user').insert({
            username:username,
            password_hash:passHash,
            role:role,
            status:status,
            fname:fname
        })
        res.status(201).json({
            success:true,
            insertId:createUser
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }  
}

exports.login = async (req,res)=>{
    try {
        const {username,password} = req.body;
        const [getUser] = await db('user').where({username:username});
        if(!getUser){
            return res.status(401).json({
                success:false,
                message:"ชื่อผู้ใช้หรือรหัสผิดพลาดกรุณาลองอีกครั้ง"
            })
        }
        const isMatch = await bcrypt.compare(password,getUser.password_hash);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"ชื่อผู้ใช้หรือรหัสผิดพลาดกรุณาลองอีกครั้ง"
            })
        }
        const data = {
            id:getUser.id,
            username:getUser.username,
            role:getUser.role,
            status:getUser.status,
            fname:getUser.fname
        }
        
        const token = jwt.sign(data,'KEY',{expiresIn:'1d'})
        res.status(200).json({
            success:true,
            data:data,
            token:token
        })
        
    } catch (error) {
                res.status(500).json({
            success:false,
            message:error.message
        })
    }    
}