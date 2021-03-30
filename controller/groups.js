/* 用户组管理模块 */
const {Sequelize,Group,UserGroup,UserRole,Hospital,HospitalGroup}=require('../db/mysql/models')
const {userInfo,operateAccessValidate}=require('./users')
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
        include,
        limit:pageSize,
        offset:pageIndex-1
    })
    let {count,rows:groups}=JSON.parse(JSON.stringify(result))

    ctx.body= {count,groups,pageIndex,pageSize}
}
//创建一个用户组
exports.createGroup=async ctx=>{
    ctx.verifyParams({
        groupName:{type:"string",required:true},
        parentGroupId:{type:"int",required:false},
        status:{type:"boolean",required:false,default:1},
        hospitalId:{type:"array",required:true,itemType:"int"}
    })
    //验证操作权限
    await operateAccessValidate(ctx,'该权限下用户组关联的医院不能为空')
    let group=await Group.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
    for(let i=0;i<hospitalId.length;i++){
        await HospitalGroup.create({groupId:group.id,hospitalId:hospitalId[i]})
    }
    ctx.body={message:"success",status:200}
}
//删改查findGroupById,updateGroupById,removeGroupById
exports.findGroupById=async ctx=>{
    let {id}=ctx.params
    let groups=await Group.findByPk(id,{
        include:[
            {model:Hospital,through:{attributes:[]}} 
        ]
    })
    groups=JSON.parse(JSON.stringify(groups))
    ctx.body={groups}
    
}
exports.updateGroupById=async ctx=>{
    ctx.verifyParams({
        groupName:{type:"string",required:true},
        parentGroupId:{type:"int",required:false},
        status:{type:"boolean",required:false,default:1},
        hospitalId:{type:"array",required:true,itemType:"int"}
    })
    //验证操作权限
    await operateAccessValidate(ctx,'该权限下用户组关联的医院不能为空')
    let {id}=ctx.params;
    
    let group=await Group.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
    for(let i=0;i<hospitalId.length;i++){
        await HospitalGroup.update({hospitalId:hospitalId[i]},{where:{groupId:group.id}})
    }
    ctx.body={message:"success",status:200}
}

exports.removeGroupById=async ctx=>{
    let {id}=ctx.params;
    //删除所有的关联关系 group grouprole groupuser hospitalgroup
    let group=await Group.findByPk(id,{include:[Role]})
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
