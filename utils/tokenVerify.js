const jwt=require('jsonwebtoken')
const {secert}=require('../config')
module.exports={
    encrypt(data,time){
        return jwt.sign(data,secert,{expiresIn:time})
    },
    decrypt(token){
        let {loginName,id,roles}=jwt.verify(token,secert)
        return {loginName,id,roles}
        
    }
}