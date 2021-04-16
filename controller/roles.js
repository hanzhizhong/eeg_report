const {Sequelize,Role,Permission,RolePermission,UserRole,GroupRole,Hospital,HospitalRole}=require('../db/mysql/models')

class Roles{
    async find(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        let hospitalsId=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageIndex=1,pageSize=10}=ctx.query;
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let roles=await Role.findAndCountAll({
            include:[
                {model:Hospital,through:{attributes:[]},attributes:[],where:{
                    id:{
                        [Sequelize.Op.in]:hospitalsId
                    }
                }}
            ],
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body={...roles,pageSize,pageIndex};
    }
    async createRole(ctx){
        ctx.verifyParams({
            parentRoleId:{type:"int",required:true,default:0},
            roleName:{type:"string",required:true},
            roleEncode:{type:"enum",values:["admin","user","guest"],required:true},
            status:{type:"boolean",required:false,default:true},
            hospitalsId:{type:"array",required:true,itemType:"int",rule:{type:"int"}}
        })
        let {roleName,parentRoleId=0,hospitalsId=[]}=ctx.request.body;
        if(hospitalsId.length===0) ctx.throw(422,'角色关联的医院不能为空')
        //检验parentRoleId
        let level=await checkParentRoleExist(ctx,parentRoleId)
        let role=await Role.findOne({
            where:{roleName}
        })
        if(role) ctx.throw(409,'角色名称已经存在了')
        role=await Role.create({...ctx.request.body,parentRoleId,level,createdAt:new Date(),updatedAt:new Date()})
        //创建 role_hospital
        let hs_roles=hospitalsId.map(itm=>{
            let obj={}
            obj.RoleId=role.id;
            obj.HospitalId=itm;
            obj.createdAt=new Date()
            obj.updatedAt=new Date()
            return obj;
        })
        await HospitalRole.bulkCreate(hs_roles)
        ctx.body=role;
    }
    async updateRoleById(ctx){
        ctx.verifyParams({
            parentRoleId:{type:"int",required:true,default:0},
            roleName:{type:"string",required:true},
            roleEncode:{type:"enum",values:["admin","user","guest"],required:true},
            status:{type:"boolean",required:false,default:true}
        })
        let {id}=ctx.params;
        //检验parentRoleId
        let {parentRoleId=0}=ctx.request.body;
        let level=await checkParentRoleExist(ctx,parentRoleId)
        let role=await Role.update({...ctx.request.body,parentRoleId,level,updatedAt:new Date()},{where:{id}})
        ctx.body=role;
    }
    async findRoleById(ctx){
        let {id}=ctx.params;
        let role=await Role.findByPk(id,{
            include:[
                {model:Permission,through:{attributes:[]}}
            ]
        })
        ctx.body=role;
    }
    async removeRoleById(ctx){
        let {id}=ctx.params;
        //一并删除有关联关系的表 role userrole grouprole rolepermission
        await Promise.all([Role.destroy({where:{id}}),UserRole.destroy({where:{roleId:id}}),GroupRole.destroy({where:{roleId:id}}),RolePermission.destroy({where:{roleId:id}})])
        ctx.status=204;
    }
    async checkRoleExist(ctx,next){
        let {id}=ctx.params;
        let role=await Role.findByPk(id)
        if(!role) ctx.throw(404,'角色对象不存在')
        await next()
    }

    //改变和角色关联的医院
    async changeRoleRelatedHospitals(ctx){
        ctx.verifyParams({
            hospitalsId:{type:'array',required:true,itemType:"int",rule:{type:"int"}}
        })
        let {id}=ctx.params;
        let {hospitalsId}=ctx.request.body;
        if(hospitalsId.length===0) ctx.throw(422,'角色关联的医院不能为空')
        await HospitalRole.destroy({where:{roleId:id}})
        let hs_roles=hospitalsId.map(itm=>{
            let obj={}
            obj.RoleId=id;
            obj.HospitalId=itm;
            obj.createdAt=new Date()
            obj.updatedAt=new Date()
            return obj;
        })
        await HospitalRole.bulkCreate(hs_roles)
    }
    //改变用户角色的权限
    async changeRolePermissions(ctx){
        ctx.verifyParams({
            permissionsId:{type:"array",required:true,allowEmpty:true}
        })
        let {id}=ctx.params;
        //先删除已经存在的role-permission关系，然后保存当前的
        let {permissionsId}=ctx.request.body;
        await RolePermission.destroy({where:{roleId:id}});
        let role_permissions=permissionsId.map(itm=>{
            let obj={}
            obj.RoleId=id;
            obj.PermissionId=itm;
            obj.createdAt=new Date()
            obj.updatedAt=new Date()
            return obj;
        })
        role_permissions=await RolePermission.bulkCreate([...role_permissions])
        ctx.body=role_permissions;
    }
}

//检验父级role是否存在
const checkParentRoleExist=async (ctx,id)=>{
    if(id!==0){
        let role=await Role.findByPk(id)
        if(!role) ctx.throw(404,'父级角色不存在')
        return role.level+'.'+id;
    }
    return 0
}

module.exports=new Roles()