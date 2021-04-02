const Router=require('koa-router')
const router=new Router({prefix:"/actions"})

const {find,createAction,updateActionById,removeActionById, findActionById,checkActionExist}=require('../controller/actions')
const accessGrant=require('../utils/auth')

router.get('/',accessGrant('readAny','actions'),find)
router.get('/:id',accessGrant('readAny','actions'),checkActionExist,findActionById)
router.post('/',accessGrant('createAny','actions'),createAction)
router.patch('/:id',accessGrant('updateAny','actions'),checkActionExist,updateActionById)
router.delete('/:id',accessGrant('deleteAny','actions'),checkActionExist,removeActionById)
module.exports=router;

