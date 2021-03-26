const Router=require('koa-router')
const router=new Router({prefix:'/users'})


const {findByPages,createUser,checkLoginStatus,login}=require('../controller/users')

router.get('/',checkLoginStatus,findByPages)
router.post('/',createUser)
router.post('/login',login)
router.get('/me')

module.exports=router;