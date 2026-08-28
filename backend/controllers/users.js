const db = require('../db');
const bcrypt = require('bcrypt');

exports.createUser = async (req,res)=>{
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
        res.send(error)
    }
}

exports.getUser = async (req,res) =>{
    try {
        const result = await db('user').select('id','username','role','status','fname');
        console.log(result)
        res.status(200).json({
            success:true,
            data:result
        })
    } catch (error) {
        console.log(error)
    }

}