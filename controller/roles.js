const {Sequelize,Role,Permission}=require('../db/mysql/models')
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
        
    }
    async updateRoleById(ctx){

    }
    async findRoleById(ctx){

    }
    async removeRoleById(ctx){

    }
    async checkRoleExist(ctx){

    }
    //检查添加的嵌套关系是否符合规则
    async checkLevelRelated(ctx,next){
        let {level}=ctx.request.body;
        if(level.length>2){
            let tmp=level.split('.')
            //只取后两位
            tmp=tmp.slice(tmp.length-2,tmp.length+1)
            let role=await Role.findByPk(tmp[1]*1)
            if(role.parentFileId!==tmp[0]*1){
                ctx.throw(422,'嵌套层级关系是错误的')
            }
        }
        await next()
    }
}

module.exports=new Roles()