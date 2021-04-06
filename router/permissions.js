const Router=require('koa-router')
const { find, createPermission ,findActionByMenuId,findActionByElementId,findActionByFileId,updatePermissionById,removePermissionById} = require('../controller/permissions')
const router=new Router({prefix:"/permissions"})
const accessGrant=require('../utils/auth')
router.get('/',accessGrant('readAny','permissions'),find)
router.post('/',accessGrant('createAny','permissions'),createPermission)
router.get('/menus/:id',accessGrant('readAny','permissions'),findActionByMenuId)
router.get('/elements/:id',accessGrant('readAny','permissions'),findActionByElementId)
router.get('/files/:id',accessGrant('readAny','permissions'),findActionByFileId)
router.patch('/:id/menus',accessGrant('updateAny','permissions'),updatePermissionById)
router.delete('/:id',accessGrant('deleteAny','permissions'),removePermissionById)

module.exports=router;