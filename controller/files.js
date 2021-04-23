/* 前端直接上传文件 */

const qiniu=require('qiniu')
const {Sequelize,File,Hospital,User}=require('../db/mysql/models')

const {qiniu:{accessKey,secretKey,options}}=require('../config')

class Files{
    async find(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        hospitals=hospitals.map(itm=>{
            return itm.id;
        })
        let {pageIndex=1,pageSize=10,fields=''}=ctx.query;
        pageIndex=Math.max(pageIndex,1)
        pageSize=Math.max(pageSize,10)
        let files=await File.findAndCountAll({
            where:{
                fileName:{
                    [Sequelize.Op.like]:`%${fields}%`
                },
                hospitalId:{
                    [Sequelize.Op.in]:hospitals
                },
                parentFileId:0
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body=Object.assign({},files,{pageIndex,pageSize});
    }
    async createFolder(ctx){
        ctx.verifyParams({
            fileName:{type:"string",required:false,allowEmpty:true},
            parentFileId:{type:"int",required:false,default:0},
            hospitalId:{type:"int",required:true},
            patientId:{type:"int",required:true},
            typeName:{type:"enum",required:true,values:['FOLDER']}
       })
       let {fileName="新建文件夹",parentFileId=0,hospitalId,typeName}=ctx.request.body;
       //检验父级文件是否存在
       let level=await checkParentFileExist(ctx,parentFileId)
       if(fileName.length===0) fileName="新建文件夹";
       let file=await File.findOne({
           where:{
               fileName,
               parentFileId,
               hospitalId,
               level,
               typeName
           }
       })
       if(file) ctx.throw(409,'文件夹名称已经存在')
       file=await File.create({...ctx.request.body,parentFileId,fileName,level,createdAt:new Date(),updatedAt:new Date()})
       ctx.body=file;
    }
    async uploadFile(ctx){
        //这一步分是需要前端上传后传过来的上传结果
        ctx.verifyParams({
            fileName:{type:"string",required:true,allowEmpty:false},
            parentFileId:{type:"int",required:false,default:0},
            hospitalId:{type:"int",required:true},
            patientId:{type:"int",required:true},
            typeName:{type:"enum",required:true,values:['FILE']}
        })
        let {parentFileId=0}=ctx.request.body;
        //检验上级是否是文件夹
        let level=await checkParentFileExist(ctx,parentFileId)
        let file=await File.create({...ctx.request.body,parentFileId,level,createdAt:new Date(),updatedAt:new Date()})
        ctx.body=file;
    }
    async fetchUploadToken(ctx){
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let uploadToken=putPolicy.uploadToken(mac);
        ctx.body=uploadToken
    }
    async updateFileById(ctx){
        ctx.verifyParams({
            fileName:{type:"string",required:false,allowEmpty:true},
            parentFileId:{type:"int",required:false,default:0},
            hospitalId:{type:"int",required:true},
            typeName:{type:"enum",required:true,values:["FILE",'FOLDER']}
        })
        let {id}=ctx.params;
        let {parentFileId=0}=ctx.request.body;
        let level=await checkParentFileExist(ctx,parentFileId)
        let file=await File.update({...ctx.request.body,parentFileId,level,updatedAt:new Date()},{where:{id}})
        ctx.body=file;
    }
    async findFileById(ctx){
        let {Hospitals:hospitals}=ctx.state.user;
        let hospitalsId=hospitals.map(itm=>{
            return itm.id;
        })
        let {id}=ctx.params;
        let file=await File.findByPk(id)
        if(file.typeName.toLowerCase()==="folder"){
            let {pageSize=10,pageIndex=1}=ctx.query;
            pageSize=Math.max(pageSize,10)
            pageIndex=Math.max(pageIndex,1)
            file=File.findAndCountAll({
                where:{
                    level:{
                        [Sequelize.Op.like]:`${file.level}%`
                    },
                    hospitalId:{
                        [Sequelize.Op.in]:hospitalsId 
                    }
                },
                limit:pageSize,
                offset:(pageIndex-1)*pageSize
            })
            file={...file,pageIndex,pageSize}
        }
        
        ctx.body=file;
    }
    async removeFileById(ctx){
        let {id}=ctx.params;
        id=id.split(',').map(itm=>itm*1)
        //同时删除七牛云上的文件
        await removeMuchFilesFromQiniu(id)
        //判断是否是文件夹
        let files=await File.findAll({
            where:{id:{
                [Sequelize.Op.in]:id
            }}
        })
        for(let i=0;i<files.length;i++){
            if(files[i].typeName.toLowerCase()==='folder'){
                let level=`${files[i].level}.${files[i].id}`
                await File.destroy({
                    where:{
                        level:{
                            [Sequelize.Op.like]:`${level}%`
                        }
                    }
                })
            }
        }
        await File.destroy({
            where:{
                id:{
                    [Sequelize.Op.in]:id
                }
            }
        })
        ctx.status=204;
    }
    async checkFileExist(ctx,next){
        let {id}=ctx.params;
        id=id.split(',').map(itm=>{return itm*1})
        let file=await File.findAll({
            where:{
                id:{
                    [Sequelize.Op.in]:id
                }
            }
        })
        if(file.length===0) ctx.throw(404,'文件或文件夹不存在')
        await next()
    }
}
//资源管理相关的构建 bucketManager
const createBucketManager=()=>{
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z2;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    return bucketManager;
}
//删除七牛云上的文件
const removeFileFromQiniu=async ctx=>{
    let {id}=ctx.params;
    let file=await File.findByPk(id)
    if(file.typeName.toLowerCase()==='folder'){
        let level=`${file.level}.${file.id}`
        file=await File.findAll({
            where:{
                level:{
                    [Sequelize.Op.like]:`${level}%`
                }
            }
        })
        let idList=file.map(itm=>{
            return itm.id;
        })
        try{
            await removeMuchFilesFromQiniu(idList)
        }catch(err){
            throw new Error(err)
        }
    }
    var bucket = options.scope;
    var key = file.fileName;
    bucketManager=createBucketManager()
    return new Promise((resolve,reject)=>{
        bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
            if (err) {
                reject(err)
            } else {
                resolve({respInfo,respBody})
            }
        });
    })
}
//批量删除
const removeMuchFilesFromQiniu=async idList=>{
    let files=await File.findAll({where:{
        id:{
            [Sequelize.Op.in]:idList
        }
    }})
    let deleteOperations=files.map(itm=>{
        return qiniu.rs.deleteOp(options.scope,itm.fileName)
    })
    console.log('deleteO',deleteOperations)
    bucketManager=createBucketManager()
    return new Promise((resolve,reject)=>{
        bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
            if (err) {
              reject(err)
            } else {
              // 200 is success, 298 is part success
              if (parseInt(respInfo.statusCode / 100) == 2) {
                respBody.forEach(function(item) {
                  if (item.code == 200) {
                    console.log(item.code + "\tsuccess");
                  } else {
                    console.log(item.code + "\t" + item.data.error);
                  }
                });
              } else {
                  resolve({respInfo,respBody})
                console.log(respInfo.deleteusCode);
                console.log(respBody);
              }
            }
          })
    })
}

//文件上传前的解析
const analysisUploadFile=ctx=>{
    let {file}=ctx.request.files;
    return new Promise((resolve,reject)=>{
        const readStream=fs.createReadStream(file.path,{encoding:"binary"})
        let content='';
        readStream.on('data',data=>{
            content+=data;
        })
        readStream.on('end',()=>{
            let obj={}
            for(let [k,v] of Object.entries(parseFile)){
                obj[k]=iconv.decode(content.toString('utf8').slice(v[0],v[1]),'GBK').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]*/gi,'')
                /* if(k==='age'){
                    obj[k]=Number(obj[k])||null;
                } */
                /* if(k==="state"){
                    obj[k]=obj[k]?'0':obj[k]
                } */
            }
            resolve(obj)
        })
        readStream.on('error',err=>{
            reject(err)
        })
    })
    

}
//打包所有相关的文件
const packAllRelatedFiles=async ctx=>{
    let {file}=ctx.request.files;
    console.log('mmmm',file)
    let fileName=file.name.toLowerCase().replace('.nat','.zip')
    let filePath=file.path;

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

//检验父级文件
const checkParentFileExist=async (ctx,id)=>{
    if(id!==0){
        let file=await File.findByPk(id)
        if(!file) ctx.throw(404,"父级文件夹不存在")
        return file.level+'.'+id;
    }
    return 0
}

module.exports=new Files()