const Router=require('koa-router')
const router=new Router({prefix:'/users'})

//用户鉴权
const accessGrant=require('../utils/auth')

const {find,createUser,login,getLoginUserInfo,findUserById,updateUserById,removeUserById}=require('../controller/users')

router.post('/login',login)
router.get('/me',getLoginUserInfo)
router.get('/',accessGrant('readOwn','users'),find)
router.post('/',accessGrant('createOwn','users'),createUser)
router.get('/:id',accessGrant('readOwn','users'),findUserById)
router.patch('/:id',accessGrant('updateOwn','users'),updateUserById)
router.delete('/:id',accessGrant('deleteOwn','users'),removeUserById)



module.exports=router;