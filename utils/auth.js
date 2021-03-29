const ac=require('./rbac')

module.exports=function(action,resource){
    return async (ctx,next)=>{
        let {roles}=ctx.state.user;
        let grant;
        for(let i=0;i<roles.length;i++){
            grant=ac.can(roles[i].roleEncode)[action](resource).granted 
            if(grant){
                break; 
            }
        }
        grant?await next():ctx.throw(401,'当前用户没有此操作的权限')
        
    }
}