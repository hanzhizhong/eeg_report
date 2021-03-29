const Router=require('koa-router')
const router=new Router({prefix:'/group'})

/* const {find,create,updateGroupById,findGroupById,removeGroupById}=require('../controller/groups')

router.get('/',find)
router.post('/',create)
router.patch('/:id',updateGroupById)
router.get('/:id',findGroupById)
router.delete('/:id',removeGroupById) */

module.exports=router;