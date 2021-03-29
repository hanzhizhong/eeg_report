const {User,Role,Group,Menu,Permission,Element,Action,File,UserGroup,UserRole}=require('../db/mysql/models')
const {encrypt,decrypt}=require('../utils/tokenVerify')
//分页查询
exports.find=async ctx=>{
    let {pageIndex=1,pageSize=10}=ctx.query
    pageIndex=Math.max(pageIndex,1)
    pageSize=Math.max(pageSize,10)
    let result=await User.findAndCountAll({
        attributes:{exclude:['password']},
        include:[
            {model:Role,through:{attributes:[]}},
            {model:Group,through:{attributes:[]}}
        ],
        limit:pageSize,
        offset:pageIndex-1
    })
    let {count,rows:users}=JSON.parse(JSON.stringify(result))

    ctx.body= {count,users,pageIndex,pageSize}
}
//创建一个用户
exports.createUser=async ctx=>{
    ctx.verifyParams({
        loginName:{type:"string",required:true},
        userName:{type:"string",required:true},
        email:{type:"email",required:false},
        phone:{type:"string",format:/^0?(13|14|15|17|18)[0-9]{9}$/,required:false},
        password:{type:"string",min:6,required:false},
        status:{type:"boolean",required:false}
    })
    ctx.body=(await User.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()}))
}
//登录
exports.login=async ctx=>{
    let {loginName,password}=ctx.request.body;
        let user=await User.findOne({
            where:{loginName,password},
            include:[
                {model:Role,through:{attributes:[]},attributes:['roleName','roleEncode']}
            ]
        })
        user=JSON.parse(JSON.stringify(user))
        if(!user) ctx.throw(401,'user not exist, login first')
        let token=encrypt({loginName,id:user.id,roles:user.Roles},'1d')
        ctx.body={token}
}

//登录检查
exports.checkLoginStatus=async (ctx,next)=>{
    //解码token
    if(ctx.url!=='/api/users/login'){
        let token=ctx.header.authorization
        if(!token) ctx.throw(401,'鉴权失败，请求头中没有返回token值')
        token=token.replace('Bearer ','')
        let {loginName,id,roles}=decrypt(token)
        ctx.state.user={loginName,id,roles}
        await next()
    }else{
        await next()
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

//删改查findUserById,updateUserById,removeUserById
exports.findUserById=async ctx=>{
    let {id}=ctx.params
        ctx.body=(await User.findByPk(id,{
            attributes:{exclude:['password']},
            include:[
                {model:Role,through:{attributes:[]}}
            ]
        }))
}
exports.updateUserById=async ctx=>{
    let {id}=ctx.params
        ctx.verifyParams({
            loginName:{type:"string",required:true},
            userName:{type:"string",required:true},
            email:{type:"email",required:false},
            phone:{type:"string",format:/^0?(13|14|15|17|18)[0-9]{9}$/,required:false},
            password:{type:"string",min:6,required:false},
            status:{type:"boolean",required:false}
        })
        ctx.body=(await User.update({...ctx.request.body,updatedAt:new Date()},{where:{id}}))
}

exports.removeUserById=async ctx=>{
    let {id}=ctx.params;
    //删除所有的关联关系 user userrole groupuser 
    let user=await User.findByPk(id,{include:[Role]})
    if(!user) return ctx.throw(404,'用户不存在');
    user=JSON.parse(JSON.stringify(user));
    let roles=user.Roles;
    if(roles.length===1 && roles[0].roleEncode.toLowerCase()==='superadmin'){
        ctx.throw(412,'用户拥有超级管理员角色，不能被删除')
        return 
    }
    let [a,b,c]=await Promise.all([UserRole.destroy({where:{userId:id}}),UserGroup.destroy({where:{userId:id}}),User.destroy({where:{id}})])
    ctx.body="succuss"
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