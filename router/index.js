const Router=require('koa-router')
const { checkLoginStatus } = require('../controller/users')

const router=new Router({prefix:'/api'})

const users=require('./users')
const groups=require('./groups')
const actions=require('./actions')
const elements=require('./elements')
const hospitals=require('./hospitals')
router.use(checkLoginStatus)
router.use(users.routes())
router.use(groups.routes())
router.use(actions.routes())
router.use(elements.routes())
router.use(hospitals.routes())
module.exports=router;