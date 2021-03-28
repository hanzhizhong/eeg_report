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
exports.getLoginUserInfo=async ctx=>{
    let {id}=ctx.state.user;
    let user=await User.findByPk(id,{
        attributes:{exclude:['password']},
        include:[
            {model:Role,through:{attributes:[]},include:[
                {model:Permission,through:{attributes:[]}}
            ]}
        ]
    })
    user=JSON.parse(JSON.stringify(user));
    let roles=user.Roles;
    delete user.Roles;
    let {menus=[],elements=[],files=[]}=await matchCurUserMenus(roles)
    ctx.body={user,menus,elements,files}
}
//根据用户的角色匹配用户的菜单
const matchCurUserMenus=async roles=>{
    let userMenus=new Map(),
            userElements=new Map(),
            userFiles=new Map()
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
                    let t_ms=userFiles.get(permissions[i].typeId)||[];
                    userFiles.set(permissions[i].typeId,t_ms)
                    if(!permissions[i].actionId) continue;
                    userFiles.set(permissions[i].typeId,[...new Set([...t_ms,permissions[i].actionId])])
                }
            }
        }

        //遍历所有的菜单项找出属于当前用户的
        let [menus,elements,files]=await Promise.all([findCurrentUserItems(Menu,[...userMenus.keys()]),findCurrentUserItems(Element,[...userElements.keys()]),findCurrentUserItems(File,[...userFiles.keys()])])
        
        return {menus,elements,files}
}

const findCurrentUserItems=async (type,aId)=>{
    let types=await type.findAll()
    let tmp=[]
    types=JSON.parse(JSON.stringify(types))
    for(let i=0;i<types.length;i++){
        if(aId.includes(types[i].id)){
            tmp.push(types[i]) 
        }
    }
    return tmp;
}