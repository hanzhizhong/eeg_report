const {Sequelize,Menu,Permission}=require('../db/mysql/models')

class Menus{
    async find(ctx){
        let {pageSize=10,pageIndex=1,fields=""}=ctx.query;
        pageSize=Math.max(10,pageSize)
        pageIndex=Math.max(1,pageIndex)
        let menus=await Menu.findAndCountAll({
            where:{
                menuName:{
                    [Sequelize.Op.like]:`%${fields}%`
                }
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body={...menus,pageIndex,pageSize};
    }
    async findAll(ctx){
        let menus=await Menu.findAll()
        ctx.body=menus;
    }
    async createMenu(ctx){
        ctx.verifyParams({
            menuName:{type:"string",required:true},
            status:{type:"boolean",required:false,default:true},
            menuUrl:{type:"url",allowEmpty:true},
            parentMenuId:{type:"int",required:true,default:0}
        })
        let {menuName,menuUrl,parentMenuId=0}=ctx.request.body;
        //检验parentMenuId 的菜单是否存在并且确定菜单层级
        let level=await checkParentMenuExist(ctx,parentMenuId)
        let menu=await Menu.findOne({
            where:{
                [Sequelize.Op.or]:{
                    menuName,
                    menuUrl 
                }
            }
        })
        if(menu) return ctx.throw(409,'菜单名或者菜单路径已经存在')
        menu=await Menu.create({...ctx.request.body,parentMenuId,level,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=menu;
    }
    async findMenuById(ctx){
        let {id}=ctx.params;
        let menu=await Menu.findByPk(id)
        let menus=await Menu.findAll({
            where:{
                level:{
                    [Sequelize.Op.like]:`${menu.level}.${menu.id}%`
                }
            }
        })
        ctx.body={menu,menus};
    }
    async updateMenuById(ctx){
        ctx.verifyParams({
            menuName:{type:"string",required:true},
            menuUrl:{type:"url",allowEmpty:true},
            status:{type:"boolean",required:false,default:true},
            parentMenuId:{type:"int",required:false}
        })
        let {id}=ctx.params;
        let {parentMenuId=0}=ctx.request.body;
        //检验父级菜单是否存在
        let level=await checkParentMenuExist(ctx,parentMenuId)
        let menu=await Menu.update({...ctx.request.body,parentMenuId,level,updatedAt:new Date()},{where:{id}})
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
const checkParentMenuExist =async (ctx,id)=>{
    if(id!==0){
        let menu=await Menu.findByPk(id)
        if(!menu) ctx.throw(422,'父级菜单不存在')
        return menu.level+'.'+id;
    }   
    return 0
}

module.exports=new Menus()