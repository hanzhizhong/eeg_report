const Koa=require('koa')
const app=new Koa()
const fs=require('fs')
const path=require('path')
const Router=require('koa-router')
const router=new Router()
const koaBody=require('koa-body')
const jsonError=require('koa-json-error');
const parameter=require('koa-parameter')
const morgan=require('koa-morgan')
const routesUrl=require('./router')
parameter(app);
app.use(koaBody())
//监听请求体数据
app.use(jsonError({
    postFormat:(e,{stack,...rest})=>{
        return process.env.NODE_ENV==='production'?rest:{stack,...rest}
    }
}))
let accessLogStream=fs.createWriteStream(path.join(__dirname,'logs/access.log'),{flags:"a"})
app.use(morgan('combined',{stream:accessLogStream}))

router.use(routesUrl.routes())
//启动路由

app.use(router.routes()) 
//路由的检测功能 预检 http options中本路径实现和允许的方法 2.412未实现501不允许
app.use(router.allowedMethods())

const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`server is starting at port ${port}`)
})