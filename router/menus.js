const Router=require('koa-router')
const router=new Router({prefix:"/menus"})
const {find, createMenu, findMenuById, checkMenuExist, updateMenuById, removeMenuById}=require('../controller/menus')
router.get('/',find)
router.post('/',createMenu)
router.get('/:id',checkMenuExist,findMenuById)
router.patch('/:id',checkMenuExist,updateMenuById)
router.delete('/:id',checkMenuExist,removeMenuById)

module.exports=router;