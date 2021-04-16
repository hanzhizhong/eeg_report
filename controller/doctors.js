const {Sequelize,Doctor,HospitalDoctor,Hospital}=require('../db/mysql/models')
class Doctors{
    async find(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        hospitals=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageSize=10,pageIndex=1,fields=""}=ctx.query;
        pageSize=Math.max(pageSize,10)
        pageIndex=Math.max(pageIndex,1)
        let doctors=await Doctor.findAndCountAll({
            include:[
                {model:Hospital,attributes:[],through:{attributes:[]},where:{
                    id:{
                        [Sequelize.Op.in]:hospitals
                    }
                }}
            ],
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body=doctors;
    }
    async createDoctor(ctx){
        ctx.verifyParams({
            doctorName:{type:"string",required:true},
            gender:{type:"enum",values:["男","女","其他"],required:false},
            status:{type:"boolean",required:false,default:true},
            phone:{type:"string",required:false,format:/^0?(13|14|15|17|18)[0-9]{9}$/,allowEmpty:true},
            hospitalId:{type:"array",required:true,itemType:"int",rule:{type:"int"}}
        })
        let {Hospitals:hospitals}=ctx.state.user;
        hospitals=hospitals.map(itm=>{
            return itm.id;
        })
        let {doctorName,phone=null,hospitalId=[]}=ctx.request.body;
        let doctor=await Doctor.findOne({
            include:[
                {model:Hospital,through:{attributes:[]},where:{
                    id:{
                        [Sequelize.Op.in]:hospitals
                    }
                }}
            ],
            where:{
                doctorName,
                phone
            }
        })
        if(doctor) ctx.throw(409,'医师已经存在')
        //同时创建医师和关联的医院
        if(hospitalId.length===0) ctx.throw(422,'未绑定关联医院')
        doctor=await Doctor.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
        let h_doctors=hospitalId.map(itm=>{
            let obj={}
            obj.DoctorId=doctor.id;
            obj.HospitalId=itm;
            obj.createdAt=new Date()
            obj.updatedAt=new Date()
            return obj;
        })
        await HospitalDoctor.bulkCreate(h_doctors)
        ctx.body=doctor;
    }
    async findDoctorById(ctx){
        let {id}=ctx.params;
        let doctor=await Doctor.findByPk(id,{
            include:[
                {model:Hospital,through:{attributes:[]}}
            ]
        })
        ctx.body=doctor;
    }
    async updateDoctorById(ctx){
        ctx.verifyParams({
            doctorName:{type:"string",required:true},
            gender:{type:"enum",values:["男","女","其他"],required:false,default:"其他"},
            status:{type:"boolean",required:false,default:true},
            phone:{type:"string",required:false,format:/^0?(13|14|15|17|18)[0-9]{9}$/,allowEmpty:true}
        })
        let {id}=ctx.params;
        let doctor=await Doctor.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
        ctx.body=doctor;
    }
    async removeDoctorById(ctx){
        let {id}=ctx.params;
        //删除关联的表 doctor hospitaldoctor
        await Promise.all([Doctor.destroy({where:{id}}),HospitalDoctor.destroy({where:{doctorId:id}})])
        ctx.status=204
    }
    async checkDoctorExist(ctx,next){
        let {id}=ctx.params;
        let doctor=await Doctor.findByPk(id)
        if(!doctor) ctx.throw(404,'医师不存在')
        await next()
    }
    //修改医师绑定的医院
    async changeDoctorRelatedHospitals(ctx){
        ctx.verifyParams({
            idList:{type:"array",requried:true,itemType:"int",rule:{type:"int"}}
        })
        let {id}=ctx.params;
        await HospitalDoctor.destroy({where:{doctorId:id}})
        let {idList}=ctx.request.body;
        let hospital_doctors=idList.map(itm=>{
            let obj={}
            obj.HospitalId=itm;
            obj.DoctorId=id;
            obj.createdAt=new Date();
            obj.updatedAt=new Date();
            return obj;
        })
        hospital_doctors=await HospitalDoctor.bulkCreate([...hospital_doctors])
        ctx.body=hospital_doctors;
    }
}

module.exports=new Doctors()