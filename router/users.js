const Router=require('koa-router')
const router=new Router({prefix:'/users'})

//用户鉴权
const accessGrant=require('../utils/auth')

const {find,createUser,login,getLoginUserInfo,findUserById,updateUserById,removeUserById}=require('../controller/users')

router.post('/login',login)
router.get('/me',getLoginUserInfo)
router.get('/',accessGrant('readOwn','user'),find)
router.post('/',accessGrant('createOwn','user'),createUser)
router.get('/:id',accessGrant('readOwn','user'),findUserById)
router.patch('/:id',accessGrant('updateOwn','user'),updateUserById)
router.delete('/:id',accessGrant('deleteOwn','user'),removeUserById)



module.exports=router;