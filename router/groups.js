const Router=require('koa-router')
const router=new Router({prefix:'/groups'})
//角色权限鉴定
const accessGrant=require('../utils/auth')
const {find,createGroup,updateGroupById,findGroupById,removeGroupById,checkGroupExist}=require('../controller/groups')

router.get('/',accessGrant('readOwn','groups'),find)
router.post('/',accessGrant('createOwn','groups'),createGroup)
router.patch('/:id',accessGrant('updateOwn','groups'),checkGroupExist,updateGroupById)
router.get('/:id',accessGrant('readOwn','groups'),checkGroupExist,findGroupById)
router.delete('/:id',accessGrant('deleteOwn','groups'),checkGroupExist,removeGroupById)

module.exports=router;