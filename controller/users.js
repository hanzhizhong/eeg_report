const {User,Role,Group,Menu,Permission,Element,Action,File}=require('../db/mysql/models')
const {encrypt,decrypt}=require('../utils/tokenVerify')
//分页查询
exports.findByPages=async ctx=>{
    try{
        console.log('ttt',ctx.query)
        ctx.body= (await User.findAll({attributes:{exclude:['password']},include:[
            {model:Role,through:{attributes:[]}},
            {model:Group,through:{attributes:[]}}
        ]}))
    }catch(err){
        throw new Error(err)
    }
}
//创建一个用户
exports.createUser=async ctx=>{
    try{
        let {userName,password,institutionId,loginName,email,phone,gender,avatar,status,roleId,groupId}=ctx.request.body;
        ctx.body=(await User.create({userName,password,institutionId,loginName,email,phone,gender,avatar,status,roleId,groupId}))
    }catch(err){
        console.log('err',创建用户信息错误)
    }
}
//登录
exports.login=async ctx=>{
    try{
        let {loginName,password}=ctx.request.body;
        let user=await User.findOne({
            where:{loginName,password}
        })
        if(!user) ctx.throw(401,'user not exist, login first')
        let token=encrypt({loginName,id:user.id},'1d')
        ctx.body={token}
    }catch(err){
        console.log('err',err)
    }
}

//登录检查
exports.checkLoginStatus=async (ctx,next)=>{
    //解码token
    try{
        let token=ctx.header.authorization.replace('Bearer ','')
        let {loginName,id}=decrypt(token)
        ctx.state.user={loginName,id}
       await next()
    }catch(err){
        throw new Error(err)
    }

}

//请求个人信息并返回当前用户配对的菜单项
exports.userInfo=ctx=>{
    console.log('user',ctx.state.user)
    User.findByPk(id,{
        include:[
            {model:Role,through:{attributes:[]},include:[
                {model:Permission,through:{attributes:[]}}
            ]}
        ]
    })
    /* let userMenus=new Map(),
            userElements=new Map(),
            userFiles=new Map()
        let roles=JSON.parse(JSON.stringify(user)).Roles;
        for(let i=0;i<roles.length;i++){
            let permissions=roles[i].Permissions;
            for(let i=0;i<permissions.length;i++){
                if(permissions[i].typeName==='MENU'){
                    let t_ms=userMenus.get(permissions[i].typeId)||[];
                    userMenus.set(permissions[i].typeId,t_ms)
                    if(!permissions[i].actionId) continue;
                    userMenus.set(permissions[i].typeId,[...new Set([...t_ms,permissions[i].actionId])])

                }
                else if(permissions[i].typeName==='ELEMENT'){
                    let t_ms=userElements.get(permissions[i].typeId)||[];
                    userElements.set(permissions[i].typeId,t_ms)
                    if(!permissions[i].actionId) continue;
                    userElements.set(permissions[i].typeId,[...new Set([...t_ms,permissions[i].actionId])])
                }
                else if(permissions[i].typeName==="FILE"){
                    console.log('ssss',permissions[i].typeId)
                    let t_ms=userFiles.get(permissions[i].typeId)||[];
                    userFiles.set(permissions[i].typeId,t_ms)
                    if(!permissions[i].actionId) continue;
                    userFiles.set(permissions[i].typeId,[...new Set([...t_ms,permissions[i].actionId])])
                }
            }
        }
        

        ctx.body={menus:[...userMenus.keys()],elements:[...userElements.keys()],files:[...userFiles.keys()]} */
}