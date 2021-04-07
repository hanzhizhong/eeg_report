const Router=require('koa-router')
const router=new Router({prefix:'/files'})
const {find, createFolder,uploadFile}=require('../controller/files')
const accessGrant=require('../utils/auth')
router.get('/',accessGrant('readAny','files'),find)
router.post('/',accessGrant('createOwn','files'),createFolder)
router.post('/',accessGrant('createOwn','files'),uploadFile)


module.exports=router

