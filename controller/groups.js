/* 用户组管理模块 */
const {Sequelize,Group,UserGroup,UserRole,Hospital,HospitalUser}=require('../db/mysql/models')
const {userInfo}=require('./users')
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
                    id:{[Sequelize.Op.in]:hospitals}
                }
            }
        ]
    }
    let {pageIndex=1,pageSize=10}=ctx.query
    pageIndex=Math.max(pageIndex,1)
    pageSize=Math.max(pageSize,10)
    let result=await Group.findAndCountAll({
        attributes:{exclude:['password']},
        include,
        limit:pageSize,
        offset:pageIndex-1
    })
    let {count,rows:groups}=JSON.parse(JSON.stringify(result))

    ctx.body= {count,groups,pageIndex,pageSize}
}
//创建一个用户组
exports.createGroup=async ctx=>{
    
    ctx.body={message:"success",status:200}
}
//删改查findGroupById,updateGroupById,removeGroupById
exports.findGroupById=async ctx=>{
    let {id}=ctx.params
    
}
exports.updateGroupById=async ctx=>{
    
}

exports.removeGroupById=async ctx=>{
    
    ctx.body={message:"success",status:200}
}
