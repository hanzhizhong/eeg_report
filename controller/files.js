/* 前端直接上传文件 */

const qiniu=require('qiniu')
const {Sequelize,File,Hospital,User}=require('../db/mysql/models')
const {loginInfo}=require('./users')

const {qiniu:{accessKey,secretKey,options}}=require('../config')

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
            attributes:{exclude:['level']},
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
                },
                parentFileId:0
            },
            limit:pageSize,
            offset:(pageIndex-1)*pageSize
        })
        ctx.body=files;
    }
    async createFolder(ctx){
        ctx.verifyParams({
            fileName:{type:"string",required:false,allowEmpty:true},
            parentFileId:{type:"int",required:true,default:0},
            hospitalId:{type:"int",required:true},
            level:{type:"string",required:true,format:/^0(\.[1-9])*$/},
            typeName:{type:"enum",required:true,values:['FOLDER']}
       })
       let {fileName="新建文件夹",parentFileId,hospitalId,level,typeName}=ctx.request.body;
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
       file=await File.create({...ctx.request.body,fileName,createdAt:new Date(),updatedAt:new Date()})
       ctx.body=file;
    }
    //校验上传的文件信息
    async checkUploadFile(ctx,next){
        let {level}=ctx.request.body;
        if(!level) ctx.throw(422,'验证参数缺失')
        /* 
            level:条件的判断
            "0.1/0.1.2"
            顶级parentId/所属上级Id/选择的parentId

            判断是否符合规矩 先判断 1 后判断2
            如0.1.2
            末尾的id=2 查看id为2的这条数据的父级id 是否和 第二个数1相等，相等就是符合条件，不等就不符条件

            传的level 1.1 最后一位和 parentId不等时，表示需要创建下一级
            相等就是创建同一级的
        */
        //检验level和parentFileId是否符合规定
        if(level.length>2){
            let tmp=level.split('.')
            //只取后两位
            tmp=tmp.slice(tmp.length-2,tmp.length+1)
            let file=await File.findByPk(tmp[1]*1)
            if(file.parentFileId!==tmp[0]*1){
                ctx.throw(422,'嵌套层级关系是错误的')
            }
        }
        await next()
    }
    async uploadFile(ctx){
        //这一步分是需要前端上传后传过来的上传结果
        ctx.verifyParams({
            fileName:{type:"string",required:true,allowEmpty:false},
            parentFileId:{type:"int",required:true,default:0},
            hospitalId:{type:"int",required:true},
            level:{type:"string",required:true,format:/^0(\.[1-9])*$/},
            typeName:{type:"enum",required:true,values:['FILE']}
        })
        
        let file=await File.create({...ctx.request.body,createdAt:new Date(),updatedAt:new Date()})
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
            parentFileId:{type:"int",required:true,default:0},
            hospitalId:{type:"int",required:true},
            level:{type:"string",required:true,format:/^0(\.[1-9])*$/},
            typeName:{type:"enum",required:true,values:["FILE",'FOLDER']}
        })
        let {id}=ctx.params;
        let file=await File.update({...ctx.request.body,updatedAt:new Date()},{where:{id}})
        ctx.body=file;
    }
    async findFileById(ctx){
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
        }
        ctx.body=file;
    }
    async removeFileById(ctx){
        let {id}=ctx.params;
        //同时删除七牛云上的文件
        //判断是否是文件夹
        let file=await File.findByPk(id)
        if(file.typeName.toLowerCase()==='folder'){
            let level=`${file.level}.${file.id}`
            file=await File.destroy({
                where:{
                    level:{
                        [Sequelize.Op.like]:`${level}%`
                    }
                }
            })
        }
        //有先后的问题
        try{
            await removeFileFromQiniu(ctx)
        }catch(err){
            throw new Error(err)
        }
        await File.destroy({where:{id}})
        ctx.status=204;
    }
    //批量删除
    async removeMuchFiles(ctx){
        let {idList}=ctx.request.body;
        await removeMuchFilesFromQiniu(idList)
        await File.destroy({where:{id:{[Seqeulize.Op.in]:idList}}})
        ctx.status=204;
    }
    async checkFileExist(ctx,next){
        let {id}=ctx.params;
        let file=await File.findByPk(id)
        if(!file) ctx.throw(404,'文件或文件夹不存在')
        await next()
    }
    async checkFilesExist(ctx,next){
        let {idList}=ctx.request.body;
        let files=await File.findAll({
            where:{
                id:{
                    [Sequelize.Op.in]:idList
                }
            }
        })
        console.log('ffff',files)
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

module.exports=new Files()