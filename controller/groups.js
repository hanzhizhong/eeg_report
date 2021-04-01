/* 用户组管理模块 */
const {Sequelize,Group,GroupRole,Role,GroupUser,Hospital,HospitalGroup}=require('../db/mysql/models')

class Groups{
    //分页查询
    async find(ctx){
        let {id:createBy}=ctx.state.user;
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let result=await Group.findAndCountAll({
            where:{
                groupName:{
                    [Sequelize.Op.like]:`%${fields}%`
                },
                createBy
            },
            limit:pageSize,
            offset:pageIndex-1
        })
        let {count,rows:groups}=JSON.parse(JSON.stringify(result))

        ctx.body= {count,groups,pageIndex,pageSize}
    }
    //创建一个用户组
    async createGroup(ctx){
        ctx.verifyParams({
            groupName:{type:"string",required:true},
            parentGroupId:{type:"int",required:false},
            status:{type:"boolean",required:false,default:true}
        })
        let {groupName}=ctx.request.body;
        let group=await Group.findOne({where:{groupName}})
        if(group) return ctx.throw(409,'用户组已经存在了')
        let {id:createBy}=ctx.state.user;
        group=await Group.create({...ctx.request.body,createBy,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=group
    }
    //删改查findGroupById,updateGroupById,removeGroupById
    async findGroupById(ctx){
        let {id}=ctx.params
        let group=await Group.findByPk(id)
        group=JSON.parse(JSON.stringify(groups))
        ctx.body=group;
    }
    async updateGroupById(ctx){
        ctx.verifyParams({
            groupName:{type:"string",required:true},
            parentGroupId:{type:"int",required:false},
            status:{type:"boolean",required:false,default:true}
        })
        let {id}=ctx.params;
        let group=await Group.findByPk(id)
        if(!group) return ctx.throw(404,'用户组不存在')
        let {id:createBy}=ctx.state.user
        group=JSON.parse(JSON.stringify(group))
        await Group.update({...ctx.request.body,createBy,updatedAt:new Date()},{where:{id}})
        ctx.body={message:"success",status:200}
    }

    async removeGroupById(ctx){
        let {id}=ctx.params;
        //删除所有的关联关系 group grouprole groupuser hospitalgroup
        let group=await Group.findByPk(id,{include:[Role]})
        if(!group) return ctx.throw(404,'用户组不存在');
        group=JSON.parse(JSON.stringify(group));
        await Promise.all([Group.destroy({where:{id}}),GroupRole.destroy({where:{groupId:group.id}}),GroupUser.destroy({where:{groupId:group.id}}),HospitalGroup.destroy({where:{groupId:group.id}})])
        ctx.body={message:"success",status:200}
    }
}


module.exports=new Groups()