const Router=require('koa-router')
const { checkLoginStatus } = require('../controller/users')

const router=new Router({prefix:'/api'})

const users=require('./users')
const groups=require('./groups')
const actions=require('./actions')
const elements=require('./elements')
const hospitals=require('./hospitals')
const meetings=require('./meetings')
const menus=require('./menus')
const patients=require('./patients')
const permissions=require('./permissions')
const files=require('./files')

router.use(checkLoginStatus)
router.use(users.routes())
router.use(groups.routes())
router.use(actions.routes())
router.use(elements.routes())
router.use(hospitals.routes())
router.use(meetings.routes())
router.use(menus.routes())
router.use(patients.routes())
router.use(permissions.routes())
router.use(files.routes())

module.exports=router;