const {Sequelize,Patient,PatientFile,File}=require('../db/mysql/models')
class Patients{
    async find(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        hospitals=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query;
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let patients=await Patient.findAndCountAll({
            where:{
                [Sequelize.Op.or]:{
                    patientName:{
                        [Sequelize.Op.like]:`%${fields}%`
                    },
                    note:{
                        [Sequelize.Op.like]:`%${fields}%`
                    }
                },
                hospitalId:{
                    [Sequelize.Op.in]:hospitals
                }
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body={...patients,pageIndex,pageSize}
    }
    async createPatient(ctx){
        ctx.verifyParams({
            patientName:{type:"string",required:true},
            eegNo:{type:"string",required:true},
            phone:{type:"string",format:/^0?(13|14|15|17|18)[0-9]{9}$/,allowEmpty:true},
            gender:{type:"enum",values:['男','女','其他'],required:false},
            age:{type:'int',required:false,max:200},
            checkDate:{type:"datetime",allowEmpty:true,required:false},
            status:{type:"boolean",required:false,default:true},
            diagnosticianId:{type:"int",required:false},
            applyDoctorId:{type:"int",required:false},
            operateDoctorId:{type:"int",required:false},
            hospitalId:{type:"int",required:true},
            reportStatus:{type:"enum",values:[0,1,2,3,4],required:false}
        })
        let {patientName,eegNo}=ctx.request.body;
        let patient=await Patient.findOne({
            where:{
                patientName,
                eegNo
            }
        })
        patient=await Patient.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=patient;
    }
    async findPatientById(ctx){
        let {id}=ctx.params;
        let patient=await Patient.findByPk(id);
        ctx.body=patient;
    }
    async updatePatientById(ctx){
        ctx.verifyParams({
            patientName:{type:"string",required:true},
            eegNo:{type:"string",required:true},
            phone:{type:"string",format:/^0?(13|14|15|17|18)[0-9]{9}$/,allowEmpty:true},
            gender:{type:"enum",values:['男','女','其他'],required:false},
            age:{type:'int',required:false,max:200},
            checkDate:{type:"datetime",allowEmpty:true,required:false},
            status:{type:"boolean",required:false,default:true},
            diagnosticianId:{type:"int",required:false},
            applyDoctorId:{type:"int",required:false},
            operateDoctorId:{type:"int",required:false},
            hospitalId:{type:"int",required:true},
            reportStatus:{type:"enum",values:[0,1,2,3,4],required:false}
        })
        let {id}=ctx.params;
        let patient=await Patient.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
        ctx.body=patient;
    }
    async removePatientById(ctx){
        let {id}=ctx.params;
        await Promise.all([Patient.destroy({where:{id}}),PatientFile.destroy({where:{patientId:id}})])
        ctx.status=204;
    }
    async checkPatientExist(ctx,next){
        let {id}=ctx.params;
        let patient=await Patient.findByPk(id)
        if(!patient) return ctx.throw(404,'患者不存在')
        await next()
    }
    //特定id患者的报告列表
    async findPatientFilesById(ctx){
        let {id}=ctx.params;
        let files=await File.findAll({
            include:[
                {model:Patient,attributes:[],where:{
                    id
                }}
            ]
        })
        ctx.body=files;
    }
    //注意患者的文件和当前登录用户能够操作查看（下载，导出、打印等）的文件区别
    async patientFilesUpdate(ctx){
        let {patientId,fileId}=ctx.params
        let tmp=await PatientFile.findOne({where:{patientId,fileId}})
        if(!tmp) {
            tmp=await PatientFile.create({PatientId:patientId,FileId:fileId,createdAt:new Date(),updatedAt:new Date()})
            ctx.body=tmp;

        }else{
            ctx.throw(409,'患者报告已经存在')
        }
    }
    async patientFilesRemove(ctx){
        let {patientId,fileId}=ctx.params;
        let tmp=await PatientFile.findOne({where:{patientId,fileId}})
        if(!tmp) return ctx.throw(404,'患者报告不存在')
        await PatientFile.destroy({where:{patientId,fileId}})
        ctx.status=204
    }
}

module.exports=new Patients()
