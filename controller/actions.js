/* 功能操作模块 只有超级管理员有所有权限 管理员只有阅读和编辑*/

const {Sequelize,Action,Permission}=require('../db/mysql/models')

class Actions{
    async find(ctx){
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let result=await Action.findAndCountAll({
            where:{
                actionName:{
                    [Sequelize.Op.like]:`%${fields}%`
                }
            },
            limit:pageSize,
            offset:pageIndex-1
        })
        let {count,rows:actions}=JSON.parse(JSON.stringify(result))

        ctx.body= {count,actions,pageIndex,pageSize}
    }
    async createAction(ctx){
        ctx.verifyParams({
            actionName:{type:'string',required:true},
            actionEncode:{type:"string",format:/^[a-zA-Z]{4,}$/,required:true,min:4},
            status:{type:"boolean",default:true,required:false}
        })
        let {actionName,actionEncode}=ctx.request.body;
        actionEncode=actionEncode.toUpperCase()
        let action=await Action.findOne({
            where:{
                [Sequelize.Op.or]:{
                    actionName,
                    actionEncode
                }
            }
        })
        if(action) return ctx.throw(409,'当前功能操作已经存在')
        action=await Action.create({...ctx.request.body,actionEncode,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=action;
    }
    //检验操作功能是否存在
    async checkActionExist(ctx,next){
        let {id}=ctx.params;
        let action=await Action.findByPk(id)
        if(!action) return ctx.throw(404,'当前功能操作不存在')
        await next()
    }
    async findActionById(ctx){
        let {id}=ctx.params;
        let action=await Action.findByPk(id)
        ctx.body=action
    }
    async updateActionById(ctx){
        ctx.verifyParams({
            actionName:{type:'string',required:true},
            actionEncode:{type:"string",format:/^[a-zA-Z]{4,}$/,required:true,min:4},
            status:{type:"boolean",default:true,required:false}
        })
        let {id}=ctx.params;
        let {actionEncode}=ctx.request.body;
        actionEncode=actionEncode.toUpperCase()
        action=await Action.update({...ctx.request.body,actionEncode,updatedAt:new Date()},{where:{id}})
        ctx.body=action;
    }
    async removeActionById(ctx){
        let {id}=ctx.params;
        //将关联的权限中的actionId也删掉
        await Promise.all([Action.destroy({where:{id}}),Permission.destroy({where:{actionId:id}})])
        ctx.status=204
    }
}
module.exports=new Actions()