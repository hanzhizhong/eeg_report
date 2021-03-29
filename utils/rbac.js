const AccessControl=require('accesscontrol')


const grantList = [
    //guest
    {role: 'guest',resource: 'menu',action: 'read:own'},
    {role: 'guest',resource: 'element',action: 'read:own'},
    {role: 'guest',resource: 'file',action: 'read:any'},
    //user
    {role: 'user',resource: 'menu',action: 'read:own'},
    {role: 'user',resource: 'element',action: 'read:own'},
    {role: 'user',resource: 'file',action: 'read:any'},
    {role: 'user',resource: 'file',action: 'update:own'},
    {role: 'user',resource: 'file',action: 'create:own'},
    {role: 'user',resource: 'file',action: 'delete:own'},
    //admin
    {role: 'admin',resource: 'menu',action: 'read:any'},
    {role: 'admin',resource: 'menu',action: 'update:any'},
    {role: 'admin',resource: 'element',action: 'read:any'},
    {role: 'admin',resource: 'element',action: 'update:any'},
    {role: 'admin',resource: 'action',action: 'read:any'},
    {role: 'admin',resource: 'action',action: 'update:any'},
    {role: 'admin',resource: 'file',action: 'read:any'},
    {role: 'admin',resource: 'file',action: 'update:any'},
    {role: 'admin',resource: 'file',action: 'create:any'},
    {role: 'admin',resource: 'file',action: 'delete:any'},
    {role: 'admin',resource: 'user',action: 'read:own'},
    {role: 'admin',resource: 'user',action: 'update:own'},
    {role: 'admin',resource: 'user',action: 'create:own'},
    {role: 'admin',resource: 'user',action: 'delete:own'},
    {role: 'admin',resource: 'group',action: 'read:own'},
    {role: 'admin',resource: 'group',action: 'update:own'},
    {role: 'admin',resource: 'group',action: 'create:own'},
    {role: 'admin',resource: 'group',action: 'delete:own'},
    //superadmin
    {role: 'superadmin',resource: 'menu',action: 'read:any'},
    {role: 'superadmin',resource: 'menu',action: 'update:any'},
    {role: 'superadmin',resource: 'menu',action: 'delete:any'},
    {role: 'superadmin',resource: 'menu',action: 'create:any'},
    {role: 'superadmin',resource: 'element',action: 'read:any'},
    {role: 'superadmin',resource: 'element',action: 'create:any'},
    {role: 'superadmin',resource: 'element',action: 'update:any'},
    {role: 'superadmin',resource: 'element',action: 'delete:any'},
    {role: 'superadmin',resource: 'action',action: 'read:any'},
    {role: 'superadmin',resource: 'action',action: 'update:any'},
    {role: 'superadmin',resource: 'action',action: 'create:any'},
    {role: 'superadmin',resource: 'action',action: 'delete:any'},
    {role: 'superadmin',resource: 'file',action: 'read:any'},
    {role: 'superadmin',resource: 'file',action: 'update:any'},
    {role: 'superadmin',resource: 'file',action: 'create:any'},
    {role: 'superadmin',resource: 'file',action: 'delete:any'},
    {role: 'superadmin',resource: 'user',action: 'read:any'},
    {role: 'superadmin',resource: 'user',action: 'update:any'},
    {role: 'superadmin',resource: 'user',action: 'create:any'},
    {role: 'superadmin',resource: 'user',action: 'delete:any'},
    {role: 'superadmin',resource: 'group',action: 'read:any'},
    {role: 'superadmin',resource: 'group',action: 'update:any'},
    {role: 'superadmin',resource: 'group',action: 'create:any'},
    {role: 'superadmin',resource: 'group',action: 'delete:any'},
]

module.exports=new AccessControl(grantList);



