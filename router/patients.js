const Router=require('koa-router')
const { find,createPatient,checkPatientExist,findPatientById,updatePatientById,removePatientById,findPatientFilesById } = require('../controller/paitents')
const router=new Router({prefix:"/patients"})

router.get('/',find)
router.post('/',createPatient)
router.get('/:id',checkPatientExist,findPatientById)
router.patch('/:id',checkPatientExist,updatePatientById)
router.delete('/:id',checkPatientExist,removePatientById)
router.get('/:id/files',checkPatientExist,findPatientFilesById)
module.exports=router;