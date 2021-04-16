/* 会诊视频 */
const md5=require('md5')
const {secert}=require('../config')
const {Sequelize,Meeting,HospitalMeeting,Hospital}=require('../db/mysql/models')

class Meetings{
    async find(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        let hospitalsId=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageIndex=1,pageSize=10,fields=""}=ctx.query;
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let meetings=await Meeting.findAndCountAll({
            include:[
                {model:Hospital,through:{attributes:[]},attributes:[],where:{
                    id:{
                        [Sequelize.Op.in]:hospitalsId
                    }
                }}
            ],
            attributes:{exclude:['password']},
            where:{
                [Sequelize.Op.or]:{
                    roomName:{
                        [Sequelize.Op.like]:`%${fields}%`
                    }
                },
                
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body=Object.assign({},meetings,{pageSize,pageIndex})

    }
    async createMeeting(ctx){
        ctx.verifyParams({
            roomName:{type:"string",required:true},
            password:{type:"string",required:true,format:/^[a-zA-Z0-9]{6,}$/},
            hospitalsId:{type:"array",required:true,itemType:"int",rule:{type:"int"}}
        })
        let {roomName,password,hospitalsId=[]}=ctx.request.body;
        password=md5(`${secert}${password}`)
        if(hospitalsId.length===0) ctx.throw(422,'会诊关联的医院不能为空')
        let meeting=await Meeting.findOne({where:{roomName}})
        if(meeting) return ctx.throw(409,"房间已经存在")
        meeting=await Meeting.create({...ctx.request.body,password,createdAt:new Date(),updatedAt:new Date()})
        let hos_meeting=hospitalsId.map(itm=>{
            let obj={}
            obj.HospitalId=itm;
            obj.MeetingId=meeting.id;
            obj.createdAt=new Date()
            obj.updatedAt=new Date()
            return obj;
        })
        await HospitalMeeting.bulkCreate(hos_meeting)
        ctx.body=meeting
    }
    async findMeetingById(ctx){
        let {id}=ctx.params;
        let meeting=await Meeting.findByPk(id,{
            include:[
                {model:Hospital,through:{attributes:[]}}
            ],
            attributes:{exclude:['password']}
        })
        ctx.body=meeting
    }
    async updateMeetingById(ctx){
        ctx.verifyParams({
            roomName:{type:"string",required:true},
            password:{type:"string",required:true,format:/^[a-zA-Z0-9]{6,}$/}
        })
        let {id}=ctx.params;
        let {password}=ctx.request.body;
        password=md5(`${secert}${password}`)
        let meeting=await Meeting.update({...ctx.request.body,password,updatedAt:new Date()},{where:{id}})
        ctx.body=meeting
    }
    async removeMeetingById(ctx){
        let {id}=ctx.params;
        //删除关联的项 meeting hospitalmeeting
        await Promise.all([Meeting.destroy({where:{id}}),HospitalMeeting.destroy({where:{meetingId:id}})])
        ctx.status=204
    }
    async checkMeetingExist(ctx,next){
        let {id}=ctx.params;
        let meeting=await Meeting.findByPk(id)
        if(!meeting) return ctx.throw(404,'房间不存在')
        await next()
    }
    //修改会诊时关联的医院
    async changeMeetingRelatedHospitals(ctx){
        ctx.verifyParams({
            hospitalsId:{type:"array",required:true,itemType:"int",rule:{type:"int"}}
        })
        let {hospitalsId}=ctx.request.body;
        let {id}=ctx.params;
        if(hospitalsId.length===0) ctx.throw(422,'会诊关联的医院不能为空')
        await HospitalMeeting.destroy({where:{meetingId:id}})
        let hos_meeting=hospitalsId.map(itm=>{
            let obj={}
            obj.HospitalId=itm;
            obj.MeetingId=id;
            obj.createdAt=new Date()
            obj.updatedAt=new Date()
            return obj;
        })
        await HospitalMeeting.bulkCreate(hos_meeting)
        ctx.status=204;
    }
}

module.exports=new Meetings()