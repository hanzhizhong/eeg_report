const { exec, spawn } = require('child_process')

let model1 = [
    'npx sequelize-cli model:create --name User --attributes userName:string',
    'npx sequelize-cli model:create --name Permission --attributes permissionType:string',
    'npx sequelize-cli model:create --name Role --attributes roleName:string',
    'npx sequelize-cli model:create --name Menu --attributes menuName:string',
    'npx sequelize-cli model:create --name Element --attributes elemName:string',
    'npx sequelize-cli model:create --name Action --attributes actionName:string',
    'npx sequelize-cli model:create --name File --attributes fileName:string',
    'npx sequelize-cli model:create --name Group --attributes groupName:string',
    'npx sequelize-cli model:create --name GroupRole --attributes groupId:integer',
    'npx sequelize-cli model:create --name UserRole --attributes userId:integer',
    'npx sequelize-cli model:create --name UserGroup --attributes userId:integer',
    'npx sequelize-cli model:create --name Patient --attributes patientName:string',
    'npx sequelize-cli model:create --name Hospital --attributes hospitalName:string',
    'npx sequelize-cli model:create --name Doctor --attributes doctorName:string',
    'npx sequelize-cli model:create --name HospitalDoctor --attributes doctorId:integer',
    "npx sequelize-cli model:create --name Meeting --attributes roomName:string",
    "npx sequelize-cli model:create --name HospitalMeeting --attributes hospitalId:integer",
    'npx sequelize-cli model:create --name HospitalUser --attributes userId:integer',
    'npx sequelize-cli model:create --name PatientFile --attributes patientId:integer',
    "npx sequelize-cli model:create --name HospitalGroup --attributes hospitalId:integer"
]


//创建数据库表模型
const createModels = (tmp) => {
    tmp.forEach(itm => {
        exec(itm, (err, stdin, stdout) => {
            if (err) {
                console.error('err', err)
                return;
            }
            console.log('down')
        })
    })
}

//createModels(model1)

let seeds1 = [
    "npx sequelize-cli seed:create --name user",
    "npx sequelize-cli seed:create --name action",
    "npx sequelize-cli seed:create --name element",
    "npx sequelize-cli seed:create --name file",
    "npx sequelize-cli seed:create --name group",
    "npx sequelize-cli seed:create --name grouprole",
    "npx sequelize-cli seed:create --name menu",
    "npx sequelize-cli seed:create --name permission",
    "npx sequelize-cli seed:create --name role",
    "npx sequelize-cli seed:create --name userrole",
    "npx sequelize-cli seed:create --name usergroup",
    "npx sequelize-cli seed:create --name patient",
    "npx sequelize-cli seed:create --name hospital",
    "npx sequelize-cli seed:create --name doctor",
    "npx sequelize-cli seed:create --name hospitaldoctor",
    "npx sequelize-cli seed:create --name meeting",
    "npx sequelize-cli seed:create --name hospitalmeeting",
    'npx sequelize-cli seed:create --name hospitaluser',
    'npx sequelize-cli seed:create --name patientfile',
    'npx sequelize-cli seed:create --name hospitalgroup'
]


//创建种子问卷
const createSeeders = (tmp) => {
    tmp.forEach(item => {
        exec(item, err => {
            if (err) {
                console.log('err', err)
                return;
            }
            console.log('down')
        })
    })
}
//createSeeders(seeds1)