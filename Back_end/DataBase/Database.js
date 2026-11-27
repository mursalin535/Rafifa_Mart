const mysql=require('mysql2');
const rollbar = require('../rollbar');
const dbConfig = require('./dbConfig');

const pool=mysql.createPool(dbConfig);

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