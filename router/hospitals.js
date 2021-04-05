const Router=require('koa-router')
const { find,findHospitalById, createHospital, updateHospitalById, removeHospitalById,checkHospitalExist ,checkHospitalLevel} = require('../controller/hospitals')
const router=new Router({prefix:"/hospitals"})

router.get('/',find)
router.get('/:id',checkHospitalExist,findHospitalById)
router.post('/',checkHospitalLevel,createHospital)
router.patch('/:id',checkHospitalExist,checkHospitalLevel,updateHospitalById)
router.delete('/:id',checkHospitalExist,removeHospitalById)

module.exports=router;