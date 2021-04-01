/* 用户管理模块 */
const md5=require('md5')
const {secert}=require('../config')
const {Sequelize,User,Role,Menu,Permission,Element,Action,Group,File,UserGroup,UserRole,Hospital,HospitalUser}=require('../db/mysql/models')
const {encrypt,decrypt}=require('../utils/tokenVerify')
//分页查询
const find=async ctx=>{
    let {id}=ctx.state.user;
    let {pageIndex=1,pageSize=10,fields=''}=ctx.query
    pageIndex=Math.max(pageIndex,1)
    pageSize=Math.max(pageSize,10)
    let result=await User.findAndCountAll({
        attributes:{exclude:['password']},
        where:{
            [Sequelize.Op.or]:{
                loginName:{
                    [Sequelize.Op.like]:`%${fields}%`
                },
                userName:{
                    [Sequelize.Op.like]:`%${fields}%`
                },
                email:{
                    [Sequelize.Op.like]:`%${fields}%`
                },
                phone:{
                    [Sequelize.Op.like]:`%${fields}%`
                },
            },
            createBy:id
        },
        limit:pageSize,
        offset:pageIndex-1
    })
    let {count,rows:users}=JSON.parse(JSON.stringify(result))

    ctx.body= {count,users,pageIndex,pageSize}
}
//创建一个用户
const createUser=async ctx=>{
    ctx.verifyParams({
        loginName:{type:"string",required:true},
        userName:{type:"string",required:true},
        email:{type:"email",required:false},
        phone:{type:"string",format:/^0?(13|14|15|17|18)[0-9]{9}$/,required:false},
        password:{type:"string",min:6,required:false},
        status:{type:"boolean",required:false}
    })
    let {password,loginName}=ctx.request.body;
    password=md5(`${secert}${password}`)
    let {id:createBy}=ctx.state.user;
    let user=await User.findOne({where:{loginName}})
    if(user) return ctx.throw(409,'登录名已经存在')
    user=await User.create({...ctx.request.body,password,createBy,createdAt:new Date(),updatedAt:new Date()})
    user=JSON.parse(JSON.stringify(user))
    delete user.password;
    ctx.body=user;
}
//登录
const login=async ctx=>{
    ctx.verifyParams({
        loginName:{type:"string",required:true},
        password:{type:"string",required:true,min:6}
    })
    let {loginName,password}=ctx.request.body;
        password=md5(`${secert}${password}`)
        let user=await User.findOne({
            where:{loginName,password}
        })
        user=JSON.parse(JSON.stringify(user))
        if(!user) ctx.throw(401,'用户名或密码不正确')
        if(!user.status) return ctx.throw(403,'用户被禁用,联系管理员解禁')
        let token=encrypt({loginName,id:user.id},'1d')
        ctx.body={token}
}
//登录检查
const checkLoginStatus=async (ctx,next)=>{
    //解码token
    if(ctx.url!=='/api/users/login'){
        let token=ctx.header.authorization
        if(!token) ctx.throw(401,'鉴权失败，请求头中没有返回token值')
        token=token.replace('Bearer ','')
        let {loginName,id}=decrypt(token)
        ctx.state.user={loginName,id}
        await next()
    }else{
        await next()
    }

}

//请求个人信息并返回当前用户配对的菜单项
const loginInfo=async ctx=>{
    let {id}=ctx.state.user;
    let user=await User.findByPk(id,{
        attributes:{exclude:['password']},
        include:[
            {model:Role,through:{attributes:[]}},
            {model:Hospital,through:{attributes:[]}}
        ]
    })
    user=JSON.parse(JSON.stringify(user));
    ctx.body=user;
    return user;
}
//用户资源获取
const getUserResources=async ctx=>{
    let {id}=ctx.params;
    let {Roles:roles,Groups:groups}=await User.findByPk(id,{
        include:[
            {model:Role,through:{attributes:[]}},
            {model:Group,through:{attributes:[]},include:[
                {model:Role,through:{attributes:[]}}
            ]}
        ]
    })
    roles=JSON.parse(JSON.stringify(roles))
    groups=JSON.parse(JSON.stringify(groups))
    roles=roles.map(itm=>{
        return itm.id;
    })
    let groupRoles=groups.map(itm=>{
        return itm.Roles
    })
    let t_roles=[];
    for(let i=0;i<groupRoles.length;i++){
        for(let j=0;j<groupRoles[i].length;j++){
            if(!t_roles.includes(groupRoles[i][j].id)){
                t_roles.push(groupRoles[i][j].id)
            }
        }
    }
    roles=[...new Set([...roles,...t_roles])]
    
    let {menus=[],elements=[],files=[]}=await matchCurUserResources(roles)
    ctx.body={menus,elements,files}
}
//用户组
const getUserGroups=async ctx=>{
    let {id}=ctx.params;
    let {Groups:groups}=await User.findByPk(id,{
        include:[
            {model:Group,through:{attributes:[]}}
        ]
    })
    ctx.body=groups;
}
//医院
const getUserHospitals=async ctx=>{
    let {id}=ctx.params;
    let {Hospitals:hospitals}=await User.findByPk(id,{
        include:[
            {model:Hospital,through:{attributes:[]}}
        ]
    })
    ctx.body=hospitals;
}


//删改查findUserById,updateUserById,removeUserById
const findUserById=async ctx=>{
    let {id}=ctx.params
    let user=await User.findByPk(id,{
        attributes:{exclude:['password']}
    });
    user=JSON.parse(JSON.stringify(user))
    ctx.body=user;
    return user
}
const updateUserById=async ctx=>{
    let {id}=ctx.params
        ctx.verifyParams({
            loginName:{type:"string",required:true},
            userName:{type:"string",required:true},
            email:{type:"email",required:false},
            phone:{type:"string",format:/^0?(13|14|15|17|18)[0-9]{9}$/,required:false},
            password:{type:"string",min:6,required:false},
            status:{type:"boolean",required:false}
        })
        let {password}=ctx.request.body;
        password=md5(`${secert}${password}`)
        let {id:createBy}=ctx.state.user;
        let user=await User.update({...ctx.request.body,password,createBy,updatedAt:new Date()},{where:{id}})
        ctx.body={message:"success",status:200}
    
}

const removeUserById=async ctx=>{
    let {id}=ctx.params;
    //删除所有的关联关系 user userrole usergroup hospitaluser
    let user=await User.findByPk(id,{include:[Role]})
    if(!user) return ctx.throw(404,'用户不存在');
    user=JSON.parse(JSON.stringify(user));
    let roles=user.Roles;
    if(roles.length===1 && roles[0].roleEncode.toLowerCase()==='superadmin'){
        ctx.throw(412,'用户拥有超级管理员角色，不能被删除')
        return 
    }
    await Promise.all([UserRole.destroy({where:{userId:id}}),UserGroup.destroy({where:{userId:id}}),User.destroy({where:{id}}),HospitalUser.destroy({where:{userId:id}})])
    ctx.body={message:"success",status:200}
}
/**
 * 根据用户的角色匹配用户的菜单
 */
const matchCurUserResources=async roles=>{
    let permissions=await Permission.findAll({
        include:[
            {model:Role,through:{attributes:[]},where:{
                id:{[Sequelize.Op.in]:roles}
            }}
        ]
    })
    permissions=JSON.parse(JSON.stringify(permissions))
    let userMenus=new Map(),
        userElements=new Map(),
        userFiles=new Map()
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

        //遍历所有的菜单项找出属于当前用户的
        let [menus,elements,files]=await Promise.all([findCurrentUserItems(Menu,[...userMenus.keys()]),findCurrentUserItems(Element,[...userElements.keys()]),findCurrentUserItems(File,[...userFiles.keys()])]);
        //菜单和操作关联
        [menus,elements,files]=await Promise.all([mergeActions(menus,[...userMenus.values()]),mergeActions(elements,[...userElements.values()]),mergeActions(files,[...userFiles.values()])]);
        return {menus,elements,files}
}
//根据类型查找对应范围内的数据值
const findCurrentUserItems=async (type,aId)=>{
    let types=await type.findAll({
        where:{
            id:{[Sequelize.Op.in]:aId}
        }
    })
    types=JSON.parse(JSON.stringify(types))
    return types;
}
const mergeActions=async (aResources,aActions)=>{
    for(let i=0;i<aResources.length;i++){
        aResources[i].actions=await Action.findAll({
            where:{
                id:{
                    [Sequelize.Op.in]:aActions[i]
                }
            }
        })
    }

    return aResources
}

module.exports={
    find,createUser,login,checkLoginStatus,findUserById,updateUserById,removeUserById,getUserResources,getUserHospitals,getUserGroups,loginInfo
}