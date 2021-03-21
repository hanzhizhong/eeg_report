const {exec, spawn} =require('child_process')

let tmp=[
    'npx sequelize-cli model:create --name User --attributes userName:string',
'npx sequelize-cli model:create --name Permission --attributes permissionType:string',
'npx sequelize-cli model:create --name Role --attributes roleName:string',
'npx sequelize-cli model:create --name Menu --attributes menuName:string',
'npx sequelize-cli model:create --name Element --attributes elemName:string',
'npx sequelize-cli model:create --name Action --attributes actionName:string',
'npx sequelize-cli model:create --name PermissionAction --attributes permissionId:string',
'npx sequelize-cli model:create --name PermissionElement --attributes permissionId:string',
'npx sequelize-cli model:create --name PermissionMenu --attributes permissionId:string',
'npx sequelize-cli model:create --name PermissionFile --attributes permissionId:string',
'npx sequelize-cli model:create --name File --attributes fileName:string',
'npx sequelize-cli model:create --name Group --attributes groupName:string',
'npx sequelize-cli model:create --name GroupRole --attributes groupId:number',
'npx sequelize-cli model:create --name UserRole --attributes userId:number'
]


//创建数据库表模型
const createModels=()=>{
    tmp.forEach(itm=>{
        exec(itm,(err,stdin,stdout)=>{
            if(err){
                console.error('err',err)
                return;
            }
            console.log('down')
        })
    })
}

//createModels()

let aSeeds=[
    "npx sequelize-cli seed:create --name user",
    "npx sequelize-cli seed:create --name action",
    "npx sequelize-cli seed:create --name element",
    "npx sequelize-cli seed:create --name file",
    "npx sequelize-cli seed:create --name group",
    "npx sequelize-cli seed:create --name grouprole",
    "npx sequelize-cli seed:create --name menu",
    "npx sequelize-cli seed:create --name permission",
    "npx sequelize-cli seed:create --name permissionaction",
    "npx sequelize-cli seed:create --name permissionelement",
    "npx sequelize-cli seed:create --name permissionfile",
    "npx sequelize-cli seed:create --name role",
    "npx sequelize-cli seed:create --name userrole",
    "npx sequelize-cli seed:create --name permissionmenu"
]

//创建种子问卷
const createSeeders=()=>{
    aSeeds.forEach(item=>{
        exec(item,err=>{
            if(err){
                console.log('err',err)
                return;
            }
            console.log('down')
        })
    })
}
createSeeders()