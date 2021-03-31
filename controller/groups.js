/* 用户组管理模块 */
const {Sequelize,Group,GroupRole,Role,GroupUser,Hospital,HospitalGroup}=require('../db/mysql/models')
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
    let result=await Group.findAndCountAll({
        include,
        where:{
            groupName:{
                [Sequelize.Op.like]:`%${fields}%`
            }
        },
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
    let {hospitalId=[]}=ctx.request.body;
    let group=await Group.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
    for(let i=0;i<hospitalId.length;i++){
        await HospitalGroup.create({groupId:group.id,hospitalId:hospitalId[i]})
    }
    ctx.body={message:"success",status:200}
}
//删改查findGroupById,updateGroupById,removeGroupById
exports.findGroupById=async ctx=>{
    let {id}=ctx.params
    let group=await Group.findByPk(id,{
        include:[
            {model:Hospital,through:{attributes:[]}} 
        ]
    })
    group=JSON.parse(JSON.stringify(groups))
    ctx.body={group}
    return group;
    
}
exports.updateGroupById=async ctx=>{
    ctx.verifyParams({
        groupName:{type:"string",required:true},
        parentGroupId:{type:"int",required:false},
        status:{type:"boolean",required:false,default:1},
        hospitalsId:{type:"array",required:true,itemType:"int"}
    })
    //验证操作权限
    await operateAccessValidate(ctx,'该权限下用户组关联的医院不能为空')
    let {id}=ctx.params;
    let group=await Group.findByPk(id,{
        include:[
            {model:Hospital,through:{attributes:[]}}
        ]
    })
    if(!group) return ctx.throw(404,'用户组不存在')
    group=JSON.parse(JSON.stringify(group))
    let groupHos=group.Hospitals.map(itm=>{
        return itm.id;
    })
    let {hospitalsId=[]}=ctx.request.body;
    console.log('mmmmm',hospitalsId)
    let [ret]=await Group.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
    console.log('ttt',ret)
    if(!ret) return ctx.throw(412,'更新失败')
    for(let i=0;i<hospitalsId.length;i++){
        if(groupHos.includes(hospitalsId[i])){
            let ret_update=await HospitalGroup.update({hospitalId:hospitalsId[i],updatedAt:new Date()},{where:{groupId:id}})
            console.log('update',ret_update)
        }else{
            console.log('ss')
            let ret_create=await HospitalGroup.create({hospitalId:hospitalsId[i],groupId:id,createdAt:new Date(),updatedAt:new Date()})
            console.log('create',ret_create)
        }
        
    }
    ctx.body={message:"success",status:200}
}

exports.removeGroupById=async ctx=>{
    let {id}=ctx.params;
    //删除所有的关联关系 group grouprole groupuser hospitalgroup
    let group=await Group.findByPk(id,{include:[Role]})
    if(!group) return ctx.throw(404,'用户组不存在');
    group=JSON.parse(JSON.stringify(group));
    let roles=group.Roles;
    console.log('roles',roles)
    
    let [a,b,c,d]=await Promise.all([Group.destroy({where:{id}}),GroupRole.destroy({where:{groupId:group.id}}),GroupUser.destroy({where:{groupId:group.id}}),HospitalGroup.destroy({where:{groupId:group.id}})])
    ctx.body={message:"success",status:200}
}
