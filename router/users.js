const Router=require('koa-router')
const router=new Router({prefix:'/users'})


const {find,createUser,login,getLoginUserInfo,editUserInfoById,findUserById,removeUserById}=require('../controller/users')

router.get('/',find)
router.post('/',createUser)
router.patch('/:id',editUserInfoById)
router.get('/:id',findUserById)
router.delete('/:id',removeUserById)
router.post('/login',login)
router.get('/me',getLoginUserInfo)



module.exports=router;