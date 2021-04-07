const Router=require('koa-router')
const router=new Router({prefix:'/files'})
const {find, createFile}=require('../controller/files')
const accessGrant=require('../utils/auth')
router.get('/',accessGrant('readAny','files'),find)
router.post('/',accessGrant('createOwn','files'),createFile)


module.exports=router

