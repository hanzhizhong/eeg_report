const Router=require('koa-router')
const { find, createPermission ,checkResourcesExist,findActionByTypeNameId,changeActionsByTypeNameId,removePermissionById,checkPermissionExist} = require('../controller/permissions')
const router=new Router({prefix:"/permissions"})
const accessGrant=require('../utils/auth')
router.get('/',accessGrant('readAny','permissions'),find)
router.post('/',accessGrant('createAny','permissions'),checkResourcesExist,createPermission)
router.delete('/:typeName/:typeId',accessGrant('deleteAny','permissions'),checkPermissionExist,removePermissionById)
router.get('/:typeName/:typeId',accessGrant('readAny','permissions'),findActionByTypeNameId)
router.post('/:typeName/:typeId',accessGrant('createAny','permissions'),changeActionsByTypeNameId)

module.exports=router;