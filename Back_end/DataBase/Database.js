const mysql=require('mysql2');
const rollbar = require('../rollbar');
require('dotenv').config();

const pool=mysql.createPool({
    host:process.env.DATABASE_HOST || 'localhost',
    user:process.env.DATABASE_USER || 'root',
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME || 'rafifa_mart'
});

pool.getConnection((err, connection)=>{
    if(err){
        console.error("error in database connection:",err);
        rollbar.error("error occured in database connection:",err);
    } else {
        console.log("Database connected successfully");
        connection.release();
    }
});

module.exports=pool.promise();