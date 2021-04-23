const Router=require('koa-router')
const router=new Router({prefix:"/menus"})
const {find, createMenu, findMenuById, checkMenuExist, updateMenuById, removeMenuById, findAll}=require('../controller/menus')
const accessGrant=require('../utils/auth')
router.get('/',accessGrant('readAny','menus'),find)
router.get('/all',accessGrant('readAny','menus'),findAll)
router.post('/',accessGrant('createAny','menus'),createMenu)
router.get('/:id',accessGrant('readAny','menus'),checkMenuExist,findMenuById)
router.patch('/:id',accessGrant('updateAny','menus'),checkMenuExist,updateMenuById)
router.delete('/:id',accessGrant('deleteAny','menus'),checkMenuExist,removeMenuById)

module.exports=router;