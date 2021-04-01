const Router=require('koa-router')
const { checkLoginStatus } = require('../controller/users')

const router=new Router({prefix:'/api'})

const users=require('./users')
const groups=require('./groups')
const actions=require('./actions')
const elements=require('./elements')

router.use(checkLoginStatus)
router.use(users.routes())
router.use(groups.routes())
router.use(actions.routes())
router.use(elements.routes())

module.exports=router;