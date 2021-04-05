/* const md5=require('md5')
let ret=md5('god bless you123456')
console.log(ret)
 */

/* const {add2}=require('./module-test')
add2() */

/* let obj={a:1,b:2}
let ret={...obj,a:2,c:3}
console.log('ert',ret) */

class Demo{
    async add(a,b){
        await console.log(a+b)

    }
   async bbb(){
        await this.add(4,5)
    }
}
let demo=new Demo()

demo.bbb()