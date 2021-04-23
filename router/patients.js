const Router=require('koa-router')
const { find,createPatient,checkPatientExist,findPatientById,updatePatientById,removePatientById,findPatientFilesById,patientFilesUpdate ,patientFilesRemove} = require('../controller/paitents')
const router=new Router({prefix:"/patients"})

router.get('/',find)
router.post('/',createPatient)
router.get('/:id',checkPatientExist,findPatientById)
router.patch('/:id',checkPatientExist,updatePatientById)
router.delete('/:id',checkPatientExist,removePatientById)

module.exports=router;