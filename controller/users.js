const {User,Role,Group,Menu,Permission}=require('../db/mysql/models')

//分页查询
exports.findByPages=async (ctx)=>{
    try{

        ctx.body= (await User.findAll({attributes:{exclude:['password','GroupId']},include:[
            {model:Role,through:{attributes:[]}},
            {model:Group}
        ]}))
    }catch(err){
        console.log('error',err)
    }
}
//创建一个用户
exports.createUser=async ctx=>{
    try{
        let {userName,password,institutionId,loginName,email,phone,gender,avatar,status,roleId,groupId}=ctx.request.body;
        ctx.body=(await User.create({userName,password,institutionId,loginName,email,phone,gender,avatar,status,roleId,groupId}))
    }catch(err){
        console.log('err',创建用户信息错误)
    }
}
//登录查询
exports.login=async ctx=>{
    console.log('ss')
    try{
        let {loginName,password}=ctx.request.body;
        let ret=await User.findOne({where:{loginName,password},through:{attributes:[]},raw:true})
        let rId=ret.roleId||ret.groupId;
        let pRet=(await Role.findByPk(rId,{raw:true}))
        let pId=pRet.id||null;
        let aMenu=await Menu.findAll({include:[
            {model:Permission,where:{id:pId},attributes:[],through:{attributes:[]}}
        ],raw:true})
        console.log('ttt',aMenu)
        ctx.body={ret,rId,pId,aMenu}
    }catch(err){
        console.log('err',err)
    }
}