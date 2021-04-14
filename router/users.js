const Router=require('koa-router')
const router=new Router({prefix:'/users'})

//用户鉴权
const accessGrant=require('../utils/auth')

const {find,createUser,login,loginInfo,getUserResources,getUserHospitals,getUserGroups,findUserById,updateUserById,removeUserById,changeUserRelatedHospitals, checkUserExist,changeUserRelatedGroups,getUserRoles,changeUserRelatedRoles}=require('../controller/users')

router.post('/login',login)
router.get('/me',loginInfo)
router.get('/',accessGrant('readOwn','users'),find)
router.post('/',accessGrant('createOwn','users'),createUser)
router.get('/:id',accessGrant('readOwn','users'),checkUserExist,findUserById)
router.patch('/:id',accessGrant('updateOwn','users'),checkUserExist,updateUserById)
router.delete('/:id',accessGrant('deleteOwn','users'),checkUserExist,removeUserById)
router.get('/:id/resources',checkUserExist,getUserResources)
router.get('/:id/hospitals',checkUserExist,getUserHospitals)
router.post('/:id/hospitals',checkUserExist,changeUserRelatedHospitals)
router.get('/:id/groups',accessGrant('readOwn','groups'),checkUserExist,getUserGroups)
router.post('/:id/groups',accessGrant('createOwn','groups'),checkUserExist,changeUserRelatedGroups)
router.get('/:id/roles',accessGrant('readOwn','roles'),checkUserExist,getUserRoles)
router.post('/:id/roles',accessGrant('createOwn','roles'),checkUserExist,changeUserRelatedRoles)


module.exports=router;