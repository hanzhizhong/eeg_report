const Router=require('koa-router')
const { find, createMeeting, findMeetingById, updateMeetingById, removeMeetingById, checkMeetingExist, changeMeetingRelatedHospitals } = require('../controller/meetings')
const router=new Router({prefix:"/meetings"})

router.get('/',find)
router.post('/',createMeeting)
router.get('/:id',checkMeetingExist,findMeetingById)
router.patch('/:id',checkMeetingExist,updateMeetingById)
router.delete('/:id',checkMeetingExist,removeMeetingById)
router.post('/:id/hospitals',changeMeetingRelatedHospitals)

module.exports=router;