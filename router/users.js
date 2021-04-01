const Router=require('koa-router')
const router=new Router({prefix:'/users'})

//用户鉴权
const accessGrant=require('../utils/auth')

const {find,createUser,login,loginInfo,getUserResources,getUserHospitals,getUserGroups,findUserById,updateUserById,removeUserById}=require('../controller/users')

router.post('/login',login)
router.get('/me',loginInfo)
router.get('/',accessGrant('readOwn','users'),find)
router.post('/',accessGrant('createOwn','users'),createUser)
router.get('/:id',accessGrant('readOwn','users'),findUserById)
router.patch('/:id',accessGrant('updateOwn','users'),updateUserById)
router.delete('/:id',accessGrant('deleteOwn','users'),removeUserById)
router.get('/:id/resources',getUserResources)
router.get('/:id/hospitals',getUserHospitals)
router.get('/:id/groups',getUserGroups)




module.exports=router;