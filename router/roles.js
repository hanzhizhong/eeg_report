const Router=require('koa-router')
const router=new Router({prefix:"/roles"})
const accessGrant=require('../utils/auth')
const { find,checkLevelRelated, createRole, checkRoleExist, findRoleById, updateRoleById, removeRoleById,changeRolePermissions, changeRoleRelatedHospitals } = require('../controller/roles')

router.get('/',accessGrant('readOwn','roles'),find)
router.post('/',accessGrant('createOwn','roles'),createRole)
router.get('/:id',accessGrant('readOwn','roles'),checkRoleExist,findRoleById)
router.patch('/:id',accessGrant('updateOwn','roles'),checkRoleExist,updateRoleById)
router.delete('/:id',accessGrant('deleteOwn','roles'),checkRoleExist,removeRoleById)
router.post('/:id/permissions',accessGrant('createOwn','roles'),checkRoleExist,changeRolePermissions)
router.post('/:id/hospitals',changeRoleRelatedHospitals)
module.exports=router