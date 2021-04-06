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
        ctx.verifyParams({
            typeName:{type:"enum",required:true,values:['MENU','ELEMENT','FILE']},
            typeId:{type:"int",required:true,allowEmpty:false},
            actionId:{type:"int",required:true,allowEmpty:true}
        })

        let tmp=await Permission.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=tmp;
    }
    

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