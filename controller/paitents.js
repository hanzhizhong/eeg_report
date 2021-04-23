const {Sequelize,Patient,File}=require('../db/mysql/models')
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
        let {Hospitals:hospitals}=ctx.state.user;
        let hospitalsId=hospitals.map(itm=>{
            return itm.id;
        })
        let {id}=ctx.params;
        let patient=await Patient.findByPk(id,{
            include:[
                {model:File,where:{
                    hospitalId:{
                        [Sequelize.Op.in]:hospitalsId
                    }
                }}
            ]
        });
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
            hospitalId:{type:"int",required:true},
            reportStatus:{type:"enum",values:[0,1,2,3,4],required:false}
        })
        let {id}=ctx.params;
        let patient=await Patient.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
        ctx.body=patient;
    }
    async removePatientById(ctx){
        let {id}=ctx.params;
        await Promise.all([Patient.destroy({where:{id}}),File.destroy({where:{patientId:id}})])
        ctx.status=204;
    }
    async checkPatientExist(ctx,next){
        let {id}=ctx.params;
        let patient=await Patient.findByPk(id)
        if(!patient) return ctx.throw(404,'患者不存在')
        await next()
    }
    
}

module.exports=new Patients()
