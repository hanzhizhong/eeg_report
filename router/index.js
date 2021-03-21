const Router=require('koa-router')
const router=new Router({prefix:'/api'})

const users=require('./users')
router.get('/',ctx=>{
    ctx.body="未实现"
})
router.use(users.routes())

module.exports=router;