const Router=require('koa-router')
const { find, createPermission } = require('../controller/permissions')
const router=new Router({prefix:"/permissions"})
const accessGrant=require('../utils/auth')
router.get('/',accessGrant('readAny','permissions'),find)
router.post('/',accessGrant('createAny','permissions'),createPermission)
router.get('/:id',accessGrant('readAny','permissions'),findPermissionById)
router.patch('/:id',accessGrant('updateAny','permissions'),updatePermissionById)
router.delete('/:id',accessGrant('deleteAny','permissions'),removePermissionById)

module.exports=router;