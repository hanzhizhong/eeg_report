const {Sequelize,Menu,Permission}=require('../db/mysql/models')

class Menus{
    async find(ctx){
        let {pageSize=10,pageIndex=1,fields=""}=ctx.query;
        pageSize=Math.max(10,pageSize)
        pageIndex=Math.max(1,pageIndex)
        let menus=await Menu.findAndCountAll({
            include:[
                {model:Menu}
            ],
            where:{
                parentMenuId:null,
                menuName:{
                    [Sequelize.Op.like]:`%${fields}%`
                }
            },
            limit:pageSize,
            offset:pageIndex-1
        })
        ctx.body={...menus,pageIndex,pageSize};
    }
    async createMenu(ctx){
        ctx.verifyParams({
            menuName:{type:"string",required:true},
            status:{type:"boolean",required:false,default:true},
            menuUrl:{type:"url",allowEmpty:true},
            parentMenuId:{type:"int",required:false}
        })
        let {menuName,menuUrl}=ctx.request.body;
        let menu=await Menu.findOne({
            where:{
                [Sequelize.Op.or]:{
                    menuName,
                    menuUrl 
                }
            }
        })
        if(menu) return ctx.throw(409,'菜单名或者菜单路径已经存在')
        menu=await Menu.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=menu;
    }
    async findMenuById(ctx){
        let {id}=ctx.params;
        let menu=await Menu.findByPk(id,{
            include:[
                {model:Menu}
            ]
        })
        ctx.body=menu;
    }
    async updateMenuById(ctx){
        ctx.verifyParams({
            menuName:{type:"string",required:true},
            menuUrl:{type:"url",allowEmpty:true},
            status:{type:"boolean",required:false,default:true},
            parentMenuId:{type:"int",required:false}
        })
        let {id}=ctx.params;
        let menu=await Menu.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
        ctx.body=menu;
    }
    async removeMenuById(ctx){
        let {id}=ctx.params;
        await Promise.all([Permission.destroy({where:{typeId:id,typeName:"MENU"}}),Menu.destroy({where:{id}})])
        ctx.status=204;
    }
    async checkMenuExist(ctx,next){
        let {id}=ctx.params;
        let menu=await Menu.findByPk(id)
        if(!menu) return ctx.throw(404,'菜单不存在')
        await next()
    }
}

module.exports=new Menus()