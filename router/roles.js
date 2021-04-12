const Router=require('koa-router')
const router=new Router({prefix:"/roles"})
const accessGrant=require('../utils/auth')
const { find,checkLevelRelated, createRole, checkRoleExist, findRoleById, updateRoleById, removeRoleById,changeRolePermissions } = require('../controller/roles')

router.get('/',accessGrant('readOwn','roles'),find)
router.post('/',accessGrant('createOwn','roles'),checkLevelRelated,createRole)
router.get('/:id',accessGrant('readOwn','roles'),checkRoleExist,findRoleById)
router.patch('/:id',accessGrant('updateOwn','roles'),checkRoleExist,checkLevelRelated,updateRoleById)
router.delete('/:id',accessGrant('deleteOwn','roles'),checkRoleExist,removeRoleById)
router.post('/:id/permissions',accessGrant('createOwn','roles'),checkRoleExist,changeRolePermissions)

module.exports=router