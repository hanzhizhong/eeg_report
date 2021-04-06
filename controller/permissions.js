const {Sequelize,Permission,Menu,Element,File,Action}=require('../db/mysql/models')

class Permissions{
    async find(ctx){
        
        let permissions=await Permission.findAll()
        permissions=JSON.parse(JSON.stringify(permissions))
        //遍历rows中的数据 整合出 menu file element action
        let [menus,elements,files]=await handleRowsData(permissions)
        ctx.body={menus,elements,files}
    }
    async createPermission(ctx){
        //使用批量添加的方式
        let arr=ctx.request.body.map(itm=>{
            if(!['MENU','ELEMENT','FILE'].includes(itm.typeName)){
                return ctx.throw(422,'typeName参数错误')
            }else if(!itm.typeId || typeof itm.typeId!=='number'){
                return ctx.throw(422,'typeId不为空且为int')
            }else if(itm.actionId && typeof itm.actionId!=='number'){
                return ctx.throw(422,'actionId为int')
            }
            itm.actionId=itm.actionId||null;
            itm.createdAt=new Date();
            itm.updatedAt=new Date();
            return itm;
        })
        let tmp=[]
        for(let i=0;i<arr.length;i++){
            let per=await Permission.findOne({
                where:{
                    typeName:arr[i].typeName,
                    typeId:arr[i].typeId,
                    actionId:arr[i].actionId
                }
            })
            if(per) return ctx.throw(409,`当前数据类型${arr[i].typeName}已经存了`)
            per=await Permission.create(arr[i])
            tmp=[per,...tmp]
        }
        ctx.body=tmp;
    }
    //根据菜单id获取对应的actions
    async findActionByMenuId(ctx){
        let {id:typeId}=ctx.params;
        let ret=await matchActionsById(typeId,'MENU')
        ctx.body=ret;
    }
    async findActionByFileId(ctx){
        let {id:typeId}=ctx.params;
        let ret=await matchActionsById(typeId,'FILE')
        ctx.body=ret;
    }
    async findActionByElementId(ctx){
        let {id:typeId}=ctx.params;
        let ret=await matchActionsById(typeId,'ELEMENT')
        ctx.body=ret;
    }
    
    
}
//根据id值获取对应的actions
const matchActionsById=async (id,type)=>{
    let tmp=await Permission.findAll({
        where:{
            typeName:type,
            typeId:id
        }
    })
    return tmp;
}
const handleRowsData=async rows=>{
    let menu=new Map(),
    element=new Map(),
    file=new Map()
    for(let i=0;i<rows.length;i++){
        if(rows[i].typeName==='MENU'){
            let actionId=menu.get(rows[i].typeId)||[]
            menu.set(rows[i].typeId,actionId)
            if(!rows[i].actionId) continue;
            menu.set(rows[i].typeId,[...new Set([...actionId,rows[i].actionId])])
        }else if(rows[i].typeName==='ELEMENT'){
            let actionId=element.get(rows[i].typeId)||[]
            element.set(rows[i].typeId,actionId)
            if(!rows[i].actionId) continue;
            element.set(rows[i].typeId,[...new Set([...actionId,rows[i].actionId])])
        }else if(rows[i].typeName==='FILE'){
            let actionId=file.get(rows[i].typeId)||[]
            file.set(rows[i].typeId,actionId)
            if(!rows[i].actionId) continue;
            file.set(rows[i].typeId,[...new Set([...actionId,rows[i].actionId])])
        }
    }
    //匹配所有的资源
    let [menus,elements,files]=await Promise.all([matchResources(Menu,[...menu.keys()]),matchResources(Element,[...element.keys()]),matchResources(File,[...file.keys()])]);
    
    //资源和操作关联
    [menus,elements,files]=await Promise.all([mergeActions(menus,[...menu.values()]),mergeActions(elements,[...element.values()]),mergeActions(files,[...file.values()])]);
    
    return [menus,elements,files]
}
const matchResources=async (type,arr)=>{
    let tmp=await type.findAll({
        where:{
            id:{
                [Sequelize.Op.in]:arr
            }
        }
    })
    return JSON.parse(JSON.stringify(tmp))
    
}
const mergeActions=async (aResources,aActions)=>{
    for(let i=0;i<aResources.length;i++){
        aResources[i].actions=await Action.findAll({
            where:{
                id:{
                    [Sequelize.Op.in]:aActions[i]
                }
            }
        })
    }

    return aResources
}
module.exports=new Permissions()