const Router=require('koa-router')
const { checkLoginStatus } = require('../controller/users')

const router=new Router({prefix:'/api'})

const users=require('./users')
const groups=require('./groups')
router.use(checkLoginStatus)

router.use(users.routes())
router.use(groups.routes())

module.exports=router;