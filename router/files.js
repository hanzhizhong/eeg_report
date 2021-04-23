const Router=require('koa-router')
const router=new Router({prefix:'/files'})
const {find, createFolder,fetchUploadToken,uploadFile, removeFileById,updateFileById,checkFileExist,findFileById}=require('../controller/files')
const accessGrant=require('../utils/auth')
router.get('/',accessGrant('readAny','files'),find)
router.post('/',accessGrant('createOwn','files'),createFolder)
router.get('/token',fetchUploadToken)
router.post('/upload',accessGrant('createOwn','files'),uploadFile)
router.patch('/:id',accessGrant('updateOwn','files'),checkFileExist,updateFileById)
router.delete('/:id',accessGrant('deleteOwn','files'),checkFileExist,removeFileById)
router.get("/:id",accessGrant('readAny','files'),checkFileExist,findFileById)

module.exports=router

