/* 用户管理模块 */
const md5=require('md5')
const {secert}=require('../config')
const {Sequelize,User,Role,Menu,Permission,Element,Action,File,UserGroup,UserRole,Hospital,HospitalUser}=require('../db/mysql/models')
const {encrypt,decrypt}=require('../utils/tokenVerify')
//分页查询
exports.find=async ctx=>{
    let {Roles,Hospitals}=await userInfo(ctx)
    let roles=Roles.map(itm=>{
        return itm.roleEncode
    })
    let hospitals=Hospitals.map(itm=>{
        return itm.id;
    })
    let include;
    if(roles.includes('superadmin')){
        include=[
            {
                model:Hospital,through:{attributes:[]}
            }
        ]
    }else{
        include=[
            {
                model:Hospital,through:{attributes:[]},where:{
                    [Sequelize.Op.or]:{
                        id:{
                            [Sequelize.Op.in]:hospitals,
                        },
                        parentHospitalId:{
                            [Sequelize.Op.in]:hospitals,
                        }
                    }
                }
            }
        ]
    }
    let {pageIndex=1,pageSize=10,fields=''}=ctx.query
    pageIndex=Math.max(pageIndex,1)
    pageSize=Math.max(pageSize,10)

    let result=await User.findAndCountAll({
        attributes:{exclude:['password']},
        include,
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
            }
        },
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
        status:{type:"boolean",required:false},
        hospitalId:{type:"array",required:true,itemType:"int"}
    })
    //验证操作权限
    await operateAccessValidate(ctx,'该权限下创建的用户关联的医院不能为空')
    let {password,hospitalId=[]}=ctx.request.body;
    password=md5(`${secert}${password}`)
    
    let user=await User.create({...ctx.request.body,password,createdAt:new Date(),updatedAt:new Date()})
    for(let i=0;i<hospitalId.length;i++){
        await HospitalUser.create({userId:user.id,hospitalId:hospitalId[i]})
    }

    ctx.body={message:"success",status:200}
}
//登录
exports.login=async ctx=>{
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
        if(!user) ctx.throw(401,'user not exist, login first')
        let token=encrypt({loginName,id:user.id},'1d')
        ctx.body={token}
}

//登录检查
exports.checkLoginStatus=async (ctx,next)=>{
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
const userInfo=async ctx=>{
    let {id}=ctx.state.user;
    let user=await User.findByPk(id,{
        attributes:{exclude:['password']},
        include:[
            {model:Role,through:{attributes:[]}},
            {model:Hospital,through:{attributes:[]}}
        ]
    })
    user=JSON.parse(JSON.stringify(user));
    return user;
}
//导出当前登录的用户信息
exports.userInfo=userInfo;
//机构和角色权限关联判断当前用户是否能操作
const operateAccessValidate=async (ctx,msg)=>{
    let {Roles}=await userInfo(ctx)
    let roles=Roles.map(itm=>{
        return itm.roleEncode
    })
    let {hospitalId=[]}=ctx.request.body;
    //创建的用户需要和机构关联起来 
    //只有超级管理员和管理员有创建用户的权利，那么就针对这个关联
    if(!roles.includes('superadmin') && hospitalId.length===0){
        ctx.throw(422,`${msg}`)
        return
    }
}
exports.operateAccessValidate=operateAccessValidate;
exports.getLoginUserInfo=async ctx=>{
    let user=await userInfo(ctx)
    let roles=user.Roles;
    let {menus=[],elements=[],files=[]}=await matchCurUserMenus(roles)
    ctx.body={user,menus,elements,files}
}

//删改查findUserById,updateUserById,removeUserById
exports.findUserById=async ctx=>{
    let {id}=ctx.params
    ctx.body=(await User.findByPk(id,{
        attributes:{exclude:['password']},
        include:[
            {model:Role,through:{attributes:[]}},
            {model:Hospital,through:{attributes:[]}}
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
            status:{type:"boolean",required:false},
            hospitalId:{type:"array",itemType:"int",required:true}
        })
        //验证操作权限
        await operateAccessValidate(ctx,'该权限下用户关联的医院不能为空')
        let {password,hospitalId=[]}=ctx.request.body;
        password=md5(`${secert}${password}`)
        
        let user=await User.update({...ctx.request.body,password,updatedAt:new Date()},{where:{id}})
        for(let i=0;i<hospitalId.length;i++){
            await HospitalUser.update({hospitalId:hospitalId[i]},{where:{userId:user.id}})
        }
        ctx.body={message:"success",status:200}
    
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
    let [a,b,c,d]=await Promise.all([UserRole.destroy({where:{userId:id}}),UserGroup.destroy({where:{userId:id}}),User.destroy({where:{id}}),HospitalUser.destroy({where:{userId:id}})])
    ctx.body={message:"success",status:200}
}
/**
 * 根据用户的角色匹配用户的菜单
 */
const matchCurUserMenus=async roles=>{
    let rolesId=[];
    for(let i=0;i<roles.length;i++){
        rolesId.push(roles[i].id)
    }
    let permissions=await Permission.findAll({
        include:[
            {model:Role,through:{attributes:[]},where:{
                id:{[Sequelize.Op.in]:rolesId}
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
        let [menus,elements,files]=await Promise.all([findCurrentUserItems(Menu,[...userMenus.keys()]),findCurrentUserItems(Element,[...userElements.keys()]),findCurrentUserItems(File,[...userFiles.keys()])])
        
        return {menus,elements,files}
}
//根据类型查找对应范围内的数据值
const findCurrentUserItems=async (type,aId)=>{
    let types=await type.findAll({
        where:{
            id:{[Sequelize.Op.in]:aId}
        }
    })
    return types;
}