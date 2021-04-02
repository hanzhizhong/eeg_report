/* 医院模块 设计只能插入两级的医院*/
const {Sequelize,Hospital}=require('../db/mysql/models')
class Hospitals{
    async find(ctx){
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let result=await Hospital.findAndCountAll({
            include:[
                {model:Hospital}
            ],
            where:{
                parentHospitalId:null,
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
    async createHospital(ctx){
        ctx.verifyParams({
            hospitalName:{type:"string",required:true},
            parentHospitalId:{type:"int",required:false,default:null},
            status:{type:"boolean",required:false,default:true}
        })
        let hospital=await Hospital.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=hospital;
    }
    async findHospitalById(ctx){
        let {id}=ctx.params;
        id*=1;
        let hospital=await Hospital.findByPk(id,{
            include:[
                {model:Hospital}
            ]
        })
        ctx.body=hospital;
    }
    async updateHospitalById(ctx){

    }
    async removeHospitalById(ctx){

    }
    async checkHospitalExist(ctx,next){
        let {id}=ctx.params;
        let hospital=Hospital.findByPk(id)
        if(!hospital) return ctx.throw(404,'当前医院不存在')
        await next()
    }
}


module.exports=new Hospitals()