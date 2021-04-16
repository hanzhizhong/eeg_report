/* 用户组管理模块 */
const {Sequelize,Group,GroupRole,Role,GroupUser,Hospital,HospitalGroup}=require('../db/mysql/models')

class Groups{
    //分页查询
    async find(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        let hospitalsId=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let groups=await Group.findAndCountAll({
            include:[
                {model:Hospital,through:{attributes:[]},attributes:[],where:{
                    id:{
                        [Sequelize.Op.in]:hospitalsId
                    }
                }}
            ],
            where:{
                groupName:{
                    [Sequelize.Op.like]:`%${fields}%`
                }
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })

        ctx.body=Object.assign({},groups,{pageSize,pageIndex})
    }
    //创建一个用户组
    async createGroup(ctx){
        ctx.verifyParams({
            groupName:{type:"string",required:true},
            parentGroupId:{type:"int",required:false,default:0},
            status:{type:"boolean",required:false,default:true},
            hospitalsId:{type:"array",required:true,itemType:"int",rule:{type:"int"}}
        })
        
        let {groupName,parentGroupId=0,hospitalsId=[]}=ctx.request.body;
        if(hospitalsId.length===0) ctx.throw(422,'用户组关联的医院不能为空')
        //先检查parentGroupId不为零时 是否存在
        let level=await checkParentGroupExit(ctx,parentGroupId)
        let group=await Group.findOne({where:{groupName}})
        if(group) return ctx.throw(409,'用户组已经存在了')
        group=await Group.create({...ctx.request.body,parentGroupId,level,createdAt:new Date(),updatedAt:new Date()})
        let hospital_groups=hospitalsId.map(itm=>{
            let obj={}
            obj.GroupId=group.id;
            obj.HospitalId=itm.id;
            obj.createdAt=new Date();
            obj.updatedAt=new Date();
            return obj;
        })
        await HospitalGroup.bulkCreate(hospital_groups)
        ctx.body=group
    }
    //检验用户组是否已经存在
    async checkGroupExist(ctx,next){
        let {id}=ctx.params;
        let group=await Group.findByPk(id)
        if(!group) return ctx.throw(404,'用户组不存在')
        await next()
    }
    //删改查findGroupById,updateGroupById,removeGroupById
    async findGroupById(ctx){
        let {id}=ctx.params
        let group=await Group.findByPk(id,{
            include:[
                {model:Hospital,through:{attributes:[]}}
            ]
        })
        ctx.body=group;
    }
    async updateGroupById(ctx){
        ctx.verifyParams({
            groupName:{type:"string",required:true},
            parentGroupId:{type:"int",required:false,default:0},
            status:{type:"boolean",required:false,default:true}
        })
        let {parentGroupId=0}=ctx.request.body;
        //先检查parentGroupId不为零时 是否存在
        let level=await checkParentGroupExit(ctx,parentGroupId)
        let {id}=ctx.params;
        let group=await Group.update({...ctx.request.body,parentGroupId,level,updatedAt:new Date()},{where:{id}})
        ctx.body=group;
    }

    async removeGroupById(ctx){
        let {id}=ctx.params;
        //删除所有的关联关系 group grouprole groupuser hospitalgroup
        group=JSON.parse(JSON.stringify(group));
        await Promise.all([Group.destroy({where:{id}}),GroupRole.destroy({where:{groupId:group.id}}),GroupUser.destroy({where:{groupId:group.id}}),HospitalGroup.destroy({where:{groupId:group.id}})])
        ctx.status=204
    }
    //修改用户组关联的医院
    async changeGroupRelatedHospitals(ctx){
        ctx.verifyParams({
            hospitalsId:{type:"array",required:true,itemType:"int",rule:{type:"int"}} 
        })
        let {id}=ctx.params;
        let {hospitalsId}=ctx.request.body;
        if(hospitalsId.length===0) ctx.throw(422,'用户组关联的医院不能为空')
        await HospitalGroup.destroy({where:{groupId:id}})
        
        let hos_groups=hospitalsId.map(itm=>{
            let obj={}
            obj.HospitalId=itm;
            obj.GroupId=id;
            obj.createdAt=new Date()
            obj.updatedAt=new Date()
            return obj;
        })
        await HospitalGroup.bulkCreate(hos_groups)
        ctx.status=204
    }
}

//检验parentGroupId是否存在
const checkParentGroupExit=async (ctx,id)=>{
    if(id!==0){
        let group=await Group.findByPk(id)
        if(!group) ctx.throw(404,'添加的父级用户组不存在')
        return group.level+'.'+id;
    }
    return 0
}

module.exports=new Groups()