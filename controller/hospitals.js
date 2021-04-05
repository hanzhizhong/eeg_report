/* 医院模块 设计只能插入两级的医院*/
const {Sequelize,Hospital,HospitalGroup,HospitalDoctor,HospitalMeeting,HospitalUser}=require('../db/mysql/models')
class Hospitals{
    async find(ctx){
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let result=await Hospital.findAndCountAll({
            include:{
                model:Hospital,include:{
                    model:Hospital
                }
            },
            where:{
                level:"省级",
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
            limit:pageSize,
            offset:pageIndex-1
        })
        let {count,rows:hospitals}=JSON.parse(JSON.stringify(result))

        ctx.body= {count,hospitals,pageIndex,pageSize}
    }
     //检验添加或者编辑时的医院等级
     async checkHospitalLevel(ctx,next){
        let {parentHospitalId=null,level}=ctx.request.body;
        if(!parentHospitalId && level!=='省级') return ctx.throw(403,'当前操作不被允许')
        //添加的是市级时，根据parentHospitalId判断父级的等级和当前添加的等级是否是存在上下关系
        if(parentHospitalId){
            let hospital=await Hospital.findOne({where:{id:parentHospitalId}});
            if(!hospital) return ctx.throw(404,`父级为${parentHospitalId}的医疗机构不存在`)
            let {level:p_level}=hospital;
            //当前添加的是市级 那上级是省级 添加地级上级是市级
            if((level=p_level==='市级') || (level=p_level==='地级')){
                ctx.throw(403,'当前操作不被运行')
            }
        }
        await next()
    }
    async createHospital(ctx){
        ctx.verifyParams({
            hospitalName:{type:"string",required:true},
            hospitalEncode:{type:"string",required:true,format:/^[a-zA-Z]{6,24}$/},
            parentHospitalId:{type:"int",required:false,default:null},
            level:{type:"enum",required:true,values:['省级','市级','地级']},
            status:{type:"boolean",required:false,default:true}
        })
        let {hospitalEncode,hospitalName}=ctx.request.body;
        hospitalEncode=hospitalEncode.toUpperCase()
        let hospital=await Hospital.findOne({where:{hospitalEncode,hospitalName}})
        if(hospital) return ctx.throw(409,'医院名和医院编号已经存在了')
        hospital=await Hospital.create({...ctx.request.body,hospitalEncode,createdAt:new Date(),updatedAt:new Date()})
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
            parentHospitalId:{type:"int",required:false,default:null},
            level:{type:"enum",required:true,values:['省级','市级','地级']},
            status:{type:"boolean",required:false,default:true}
        })
        let {id}=ctx.params;
        let {hospitalEncode}=ctx.request.body;
        hospitalEncode=hospitalEncode.toUpperCase()
        let hospital=await Hospital.update({...ctx.request.body,hospitalEncode,updatedAt:new Date()},{where:{id}})
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


module.exports=new Hospitals()