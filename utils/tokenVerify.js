const jwt=require('jsonwebtoken')
const {secert}=require('../config')
module.exports={
    encrypt(data,time){
        return jwt.sign(data,secert,{expiresIn:time})
    },
    decrypt(token){
        try{
            let {loginName,id}=jwt.verify(token,secert)
            return {loginName,id}
        }catch(err){
            return err 
        }
        
    }
}