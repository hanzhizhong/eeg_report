const Router=require('koa-router')
const { find, createMeeting, findMeetingById, updateMeetingById, removeMeetingById, checkMeetingExist } = require('../controller/meetings')
const router=new Router({prefix:"/meetings"})

router.get('/',find)
router.post('/',createMeeting)
router.get('/:id',checkMeetingExist,findMeetingById)
router.patch('/:id',checkMeetingExist,updateMeetingById)
router.delete('/:id',checkMeetingExist,removeMeetingById)

module.exports=router;