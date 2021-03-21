const Router=require('koa-router')
const router=new Router({prefix:'/users'})

//权限验证
const {findByPages,createUser,login}=require('../controller/users')

router.get('/',findByPages)
router.post('/',createUser)
//登录
router.post('/login',login)

module.exports=router;