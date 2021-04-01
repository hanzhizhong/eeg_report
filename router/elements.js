const Router=require('koa-router')
const router=new Router({prefix:"/elements"})

const accessGrant=require('../utils/auth')
const {find,createElement,findElementById,updateElementById,removeElementById,checkElementExist}=require('../controller/elements')

router.get('/',accessGrant('readOwn','elements'),find)
router.get('/:id',accessGrant('readOwn','elements'),checkElementExist,findElementById)
router.post('/',accessGrant('createAny','elements'),createElement)
router.patch('/:id',accessGrant('updateAny','elements'),checkElementExist,updateElementById)
router.delete('/:id',accessGrant('deleteAny','elements'),checkElementExist,removeElementById)

module.exports=router;
