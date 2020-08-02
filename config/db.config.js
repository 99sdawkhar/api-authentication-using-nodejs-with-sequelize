const Sequelize = require("sequelize");
// const { decodeBase64 } = require("bcryptjs");

const sequelize = new Sequelize(
    process.env.DATABASE, 
    process.env.DATABASE_USER, 
    process.env.DATABASE_PASSWORD, 
    {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        // operatorsAliases: false,

        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    const db = {};
    
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    
module.exports = db;

// NOT USED ANYWHERE SINCE USING Sequelize
// const mysql = require('mysql2')
 
// const pool = mysql.createPool({
//     connectionLimit: 10,
//     'host' : process.env.DATABASE_HOST,
//     'user': process.env.DATABASE_USER,
//     'password': process.env.DATABASE_PASSWORD,
//     'database': process.env.DATABASE
// })

// pool.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.')
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.')
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.')
//         }
//     } else {
//                 console.log("MYSQL Connected...");
//     }
//     if (connection) connection.release()
//     return
// })

// module.exports = pool
