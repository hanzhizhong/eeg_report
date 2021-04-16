/* 医院模块 设计只能插入两级的医院*/
const {Sequelize,Hospital,HospitalGroup,HospitalDoctor,HospitalMeeting,HospitalUser}=require('../db/mysql/models')
class Hospitals{
    async find(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        let hospitalsId=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let result=await Hospital.findAndCountAll({
            where:{
                id:{
                    [Sequelize.Op.in]:hospitalsId
                },
                [Sequelize.Op.or]:{
                    hospitalName:{
                        [Sequelize.Op.like]:`%${fields}%`
                    },
                    address:{
                        [Sequelize.Op.like]:`%${fields}%`
                    },
                    introduction:{
                        [Sequelize.Op.like]:`%${fields}%`
                    }
                }
            },
            order:[['level']],
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })

        ctx.body= Object.assign({},result,{pageIndex,pageSize});
    }
    async createHospital(ctx){
        ctx.verifyParams({
            hospitalName:{type:"string",required:true},
            hospitalEncode:{type:"string",required:true,format:/^[a-zA-Z]{6,24}$/},
            parentHospitalId:{type:"int",required:true,default:0},
            status:{type:"boolean",required:false,default:true}
        })
        let {hospitalEncode,hospitalName,parentHospitalId}=ctx.request.body;
        //检验父级医院是否存在
        let level=await checkParentHospitalExit(ctx,parentHospitalId)
        hospitalEncode=hospitalEncode.toUpperCase()
        let hospital=await Hospital.findOne({where:{hospitalEncode,hospitalName}})
        if(hospital) return ctx.throw(409,'医院名和医院编号已经存在了')
        hospital=await Hospital.create({...ctx.request.body,level,hospitalEncode,createdAt:new Date(),updatedAt:new Date()})
        let {id}=ctx.state.user;
        await HospitalUser.create({UserId:id,HospitalId:hospital.id,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=hospital;
    }
   
    async findHospitalById(ctx){
        let {id}=ctx.params;
        let hospital=await Hospital.findByPk(id)
        ctx.body=hospital;
    }
    async updateHospitalById(ctx){
        ctx.verifyParams({
            hospitalName:{type:"string",required:true},
            hospitalEncode:{type:"string",required:true,format:/^[a-zA-Z]{6,24}$/},
            parentHospitalId:{type:"int",required:true,default:0},
            status:{type:"boolean",required:false,default:true}
        })
        let {id}=ctx.params;
        let {hospitalEncode,parentHospitalId}=ctx.request.body;
        //检验parentHospitalid是否存在
        let level=await checkParentHospitalExit(ctx,parentHospitalId)
        hospitalEncode=hospitalEncode.toUpperCase()
        let hospital=await Hospital.update({...ctx.request.body,level,hospitalEncode,updatedAt:new Date()},{where:{id}})
        ctx.body=hospital;
    }
    async removeHospitalById(ctx){
        let {id}=ctx.params;
        //删除时同时删除医院关联的关系 hospitaldoctor hospitalgroup hospitalmeeting,hospitaluser
        await Promise.all([Hospital.destroy({where:{id}}),HospitalDoctor.destroy({where:{hospitalId:id}}),HospitalGroup.destroy({where:{hospitalId:id}}),HospitalMeeting.destroy({where:{hospitalId:id}}),HospitalUser.destroy({where:{hospitalId:id}})])
        ctx.status=204;
    }
    async checkHospitalExist(ctx,next){
        let {id}=ctx.params;
        let hospital=Hospital.findByPk(id)
        if(!hospital) return ctx.throw(404,'当前医院不存在')
        await next()
    }
}
const checkParentHospitalExit=async (ctx,id)=>{
    if(id!==0){
        let hospital=await Hospital.findByPk(id)
        if(!hospital) ctx.throw(404,'添加的父级用户组不存在')
        return hospital.level+'.'+id;
    }
    return 0
}

module.exports=new Hospitals()