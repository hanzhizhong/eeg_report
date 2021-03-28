const Router=require('koa-router')

const router=new Router({prefix:'/api'})

const users=require('./users')

router.use(users.routes())

module.exports=router;