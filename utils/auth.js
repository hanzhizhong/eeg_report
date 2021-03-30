const ac=require('./rbac')
const {User,Role}=require('../db/mysql/models')
module.exports=function(action,resource){
    return async (ctx,next)=>{
        let {id}=ctx.state.user;
        let user=await User.findByPk(id,{
            include:[{model:Role,through:{attributes:[]}}]
        })
        let roles=JSON.parse(JSON.stringify(user)).Roles;
        let grant;
        for(let i=0;i<roles.length;i++){
            grant=ac.can(roles[i].roleEncode)[action](resource).granted 
            if(grant) break; 
        }
        grant?await next():ctx.throw(401,'当前用户没有此操作的权限')
        
    }
}