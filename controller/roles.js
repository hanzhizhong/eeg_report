const {Sequelize,Role,Permission,RolePermission,UserRole,GroupRole}=require('../db/mysql/models')
let {loginInfo}=require('./users')

class Roles{
    async find(ctx){
        let {id}=ctx.state.user;
        let {pageIndex=1,pageSize=10}=ctx.query;
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let roles=await Role.findAndCountAll({
            where:{
                createdId:id 
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body=roles;
    }
    async createRole(ctx){
        ctx.verifyParams({
            level:{type:"string",required:true},
            parentRoleId:{type:"int",required:true},
            roleName:{type:"string",required:true},
            roleEncode:{type:"enum",values:["admin","user","guest"],required:true},
            status:{type:"boolean",required:false,default:true},
            createdId:{type:"int",required:true}
        })
        let {roleName}=ctx.request.body;
        let role=await Role.findOne({
            where:{roleName}
        })
        if(role) ctx.throw(409,'角色名称已经存在了')
        role=await Role.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=role;
    }
    async updateRoleById(ctx){
        ctx.verifyParams({
            level:{type:"string",required:true},
            parentRoleId:{type:"int",required:true},
            roleName:{type:"string",required:true},
            roleEncode:{type:"enum",values:["admin","user","guest"],required:true},
            status:{type:"boolean",required:false,default:true},
            createdId:{type:"int",required:true}
        })
        let {id}=ctx.params;
        let role=await Role.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
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
    //检查添加的嵌套关系是否符合规则
    async checkLevelRelated(ctx,next){
        ctx.verifyParams({
            level:{type:"string",required:true},
            parentRoleId:{type:"int",required:true}
        })
        let {level,parentRoleId}=ctx.request.body;
        if(level.length>2){
            let tmp=level.split('.')
            //只取后两位
            tmp=tmp.slice(tmp.length-2,tmp.length+1)
            if(tmp[1]*1!==parentRoleId) ctx.throw(422,'当前不存在层级关系')
            let role=await Role.findByPk(tmp[1]*1)
            if(!role) ctx.throw(422,'添加的父层级关系不存在')
            if(role.parentRoleId!==tmp[0]*1){
                ctx.throw(422,'嵌套层级关系是错误的')
            }
        }
        await next()
    }
    //改变用户角色的权限
    async changeRolePermissions(ctx){
        ctx.verifyParams({
            idList:{type:"array",required:true,allowEmpty:true}
        })
        let {id}=ctx.params;
        //先删除已经存在的role-permission关系，然后保存当前的
        let {idList}=ctx.request.body;
        await RolePermission.destroy({where:{roleId:id}});
        let role_permissions=idList.map(itm=>{
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

module.exports=new Roles()