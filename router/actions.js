const Router=require('koa-router')
const router=new Router({prefix:"/actions"})

const {find,createAction,updateActionById,removeActionById, findActionById}=require('../controller/actions')
const accessGrant=require('../utils/auth')

router.get('/',accessGrant('readAny','actions'),find)
router.get('/:id',accessGrant('readAny','actions'),findActionById)
router.post('/',accessGrant('createAny','actions'),createAction)
router.patch('/:id',accessGrant('updateAny','actions'),updateActionById)
router.delete('/:id',accessGrant('deleteAny','actions'),removeActionById)
module.exports=router;

