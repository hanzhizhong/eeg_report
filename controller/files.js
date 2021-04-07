const qiniu=require('qiniu')
const {Sequelize,File,Hospital,User}=require('../db/mysql/models')
const {loginInfo}=require('./users')

const {accessKey,secretKey,options}=require('../config')
class Files{
    async find(ctx){
        let {Hospitals:hospitals}=await loginInfo(ctx)
        hospitals=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query;
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let files=await File.findAndCountAll({
            include:[
                {model:Hospital},
                {model:User}
            ],
            where:{
                fileName:{
                    [Sequelize.Op.like]:`%${fields}%`
                },
                hospitalId:{
                    [Sequelize.Op.in]:hospitals
                }
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body=files;
    }
    async createFile(ctx){
       ctx.verifyParams({
        //    fileName:{type:"string",required:true},
           fileUrl:{type:"url",allowEmpty:true,required:false},
           parentFileId:{type:"int",required:false},
           uploadUserId:{type:"int",required:true},
           hospitalId:{type:"int",required:true},
           status:{type:"boolean",required:false,default:true}
       })
        
       ctx.body={file:ctx.request.files,msg:ctx.request.body}; 
    }
    async findFileById(ctx){

    }
    async upateFileById(ctx){

    }
    async removeFileById(ctx){

    }
}

//上传到七牛云
const upload2Qiniu=()=>{
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);

    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;

    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key='test.mp4';
    // 文件上传
    return new Promise((resolve,reject)=>{
        formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,respBody, respInfo) {
            if (respErr) {
                reject(respErr)
            }
            if (respInfo.statusCode == 200) {
                resolve(respBody)
            } else {
                reject(`{status:${respInfo.statusCode},res:${respBody}}`)
            }
        });
    })
    
}

module.exports=new Files()