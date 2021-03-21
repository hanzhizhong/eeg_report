const AccessControl=require('accesscontrol')


//从数据库中获取用户角色-资源-权限

const {Permission,Role}=require('../db/mysql/models')



const ac=new AccessControl();

