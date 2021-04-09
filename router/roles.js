const Router=require('koa-router')

const router=new Router({prefix:"/roles"})
const { find,checkLevelRelated, createRole } = require('../controller/roles')

router.get('/',accessGrant(),find)
router.post('/',accessGrant(),checkLevelRelated,createRole)

module.exports=router