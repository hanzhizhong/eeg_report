const AccessControl=require('accesscontrol')


const grantList = [
    //guest
    {role: 'guest',resource: 'menus',action: 'read:own'},
    {role: 'guest',resource: 'elements',action: 'read:own'},
    {role: 'guest',resource: 'files',action: 'read:any'},
    //user
    {role: 'user',resource: 'menus',action: 'read:own'},
    {role: 'user',resource: 'elements',action: 'read:own'},
    {role: 'user',resource: 'files',action: 'read:any'},
    {role: 'user',resource: 'files',action: 'update:own'},
    {role: 'user',resource: 'files',action: 'create:own'},
    {role: 'user',resource: 'files',action: 'delete:own'},
    //admin
    {role: 'admin',resource: 'menus',action: 'read:any'},
    {role: 'admin',resource: 'menus',action: 'update:any'},
    {role: 'admin',resource: 'elements',action: 'read:any'},
    {role: 'admin',resource: 'elements',action: 'update:any'},
    {role: 'admin',resource: 'actions',action: 'read:any'},
    {role: 'admin',resource: 'actions',action: 'update:any'},
    {role: 'admin',resource: 'files',action: 'read:any'},
    {role: 'admin',resource: 'files',action: 'update:any'},
    {role: 'admin',resource: 'files',action: 'create:any'},
    {role: 'admin',resource: 'files',action: 'delete:any'},
    {role: 'admin',resource: 'users',action: 'read:own'},
    {role: 'admin',resource: 'users',action: 'update:own'},
    {role: 'admin',resource: 'users',action: 'create:own'},
    {role: 'admin',resource: 'users',action: 'delete:own'},
    {role: 'admin',resource: 'groups',action: 'read:own'},
    {role: 'admin',resource: 'groups',action: 'update:own'},
    {role: 'admin',resource: 'groups',action: 'create:own'},
    {role: 'admin',resource: 'groups',action: 'delete:own'},
    //superadmin
    {role: 'superadmin',resource: 'menus',action: 'read:any'},
    {role: 'superadmin',resource: 'menus',action: 'update:any'},
    {role: 'superadmin',resource: 'menus',action: 'delete:any'},
    {role: 'superadmin',resource: 'menus',action: 'create:any'},
    {role: 'superadmin',resource: 'elements',action: 'read:any'},
    {role: 'superadmin',resource: 'elements',action: 'create:any'},
    {role: 'superadmin',resource: 'elements',action: 'update:any'},
    {role: 'superadmin',resource: 'elements',action: 'delete:any'},
    {role: 'superadmin',resource: 'actions',action: 'read:any'},
    {role: 'superadmin',resource: 'actions',action: 'update:any'},
    {role: 'superadmin',resource: 'actions',action: 'create:any'},
    {role: 'superadmin',resource: 'actions',action: 'delete:any'},
    {role: 'superadmin',resource: 'files',action: 'read:any'},
    {role: 'superadmin',resource: 'files',action: 'update:any'},
    {role: 'superadmin',resource: 'files',action: 'create:any'},
    {role: 'superadmin',resource: 'files',action: 'delete:any'},
    {role: 'superadmin',resource: 'users',action: 'read:any'},
    {role: 'superadmin',resource: 'users',action: 'update:any'},
    {role: 'superadmin',resource: 'users',action: 'create:any'},
    {role: 'superadmin',resource: 'users',action: 'delete:any'},
    {role: 'superadmin',resource: 'groups',action: 'read:any'},
    {role: 'superadmin',resource: 'groups',action: 'update:any'},
    {role: 'superadmin',resource: 'groups',action: 'create:any'},
    {role: 'superadmin',resource: 'groups',action: 'delete:any'},
]

module.exports=new AccessControl(grantList);



