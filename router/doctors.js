const Router=require('koa-router')
const router=new Router({prefix:"/doctors"})
const {find, createDoctor, findDoctorById, updateDoctorById, removeDoctorById, changeDoctorRelatedHospitals, checkDoctorExist}=require('../controller/doctors')

router.get('/',find)
router.post('/',createDoctor)
router.get('/:id',checkDoctorExist,findDoctorById)
router.patch('/:id',checkDoctorExist,updateDoctorById)
router.delete('/:id',checkDoctorExist,removeDoctorById)
router.post('/:id/hospitals',checkDoctorExist,changeDoctorRelatedHospitals)
module.exports=router;
