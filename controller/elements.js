/* 页面元素模块 只有超级管理员有所有权限 管理员只有阅读和编辑 其他只有浏览*/

const {Sequelize,Element,Permission}=require('../db/mysql/models')

class Elements{
    async find(ctx){
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let result=await Element.findAndCountAll({
            where:{
                elemName:{
                    [Sequelize.Op.like]:`%${fields}%`
                }
            },
            limit:pageSize,
            offset:pageIndex-1
        })
        let {count,rows:elements}=JSON.parse(JSON.stringify(result))

        ctx.body= {count,elements,pageIndex,pageSize}
    }
    async createElement(ctx){
        ctx.verifyParams({
            elemName:{type:'string',required:true},
            elemEncode:{type:"string",format:/^[a-zA-Z]{4,}$/,required:true,min:4},
            status:{type:"boolean",default:true,required:false}
        })
        let {elemName,elemEncode}=ctx.request.body;
        elemEncode=elemEncode.toUpperCase()
        let element=await Element.findOne({
            where:{
                [Sequelize.Op.or]:{
                    elemName,
                    elemEncode
                }
            }
        })
        if(element) return ctx.throw(409,'当前功能操作已经存在')
        element=await Element.create({...ctx.request.body,elemEncode,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=element;
    }
    async findElementById(ctx){
        let {id}=ctx.params;
        let element=await Element.findByPk(id)
        ctx.body=element
    }
    async updateElementById(ctx){
        ctx.verifyParams({
            elemName:{type:'string',required:true},
            elemEncode:{type:"string",format:/^[a-zA-Z]{4,}$/,required:true,min:4},
            status:{type:"boolean",default:true,required:false}
        })
        let {id}=ctx.params;
        let {elemEncode}=ctx.request.body;
        elemEncode=elemEncode.toUpperCase()
        element=await Element.update({...ctx.request.body,elemEncode,updatedAt:new Date()},{where:{id}})
        ctx.body={message:"success",status:200}
    }
    async checkElementExist(ctx,next){
        let {id}=ctx.params;
        let element=await Element.findByPk(id)
        if(!element) return ctx.throw(404,'当前功能操作不存在')
        await next()
    }
    async removeElementById(ctx){
        let {id}=ctx.params;
        await Promise.all([Element.destroy({where:{id}}),Permission.destroy({where:{typeId:id,typeName:"ELEMENT"}})])
        ctx.body={message:"success",status:200}
    }
}
module.exports=new Elements()