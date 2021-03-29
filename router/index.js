const Router=require('koa-router')
const { checkLoginStatus } = require('../controller/users')
const router=new Router({prefix:'/api'})

const users=require('./users')

router.use(checkLoginStatus)

router.use(users.routes())

module.exports=router;