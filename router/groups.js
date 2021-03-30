const Router=require('koa-router')
const router=new Router({prefix:'/groups'})
//角色权限鉴定
const accessGrant=require('../utils/auth')
const {find,createGroup,updateGroupById,findGroupById,removeGroupById}=require('../controller/groups')

router.get('/',accessGrant('readOwn','group'),find)
router.post('/',accessGrant('createOwn','group'),createGroup)
router.patch('/:id',accessGrant('updateOwn','group'),updateGroupById)
router.get('/:id',accessGrant('readOwn','group'),findGroupById)
router.delete('/:id',accessGrant('deleteOwn','group'),removeGroupById)

module.exports=router;