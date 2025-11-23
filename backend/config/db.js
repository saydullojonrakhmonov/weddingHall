// const { Pool } = require('pg')

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "venues",
//     password: '12345qwerty',
//     port: 5432
// })

// module.exports = pool

// import {Pool} from 'pg'

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "venues",
//     password: '12345qwerty',
//     port: 5432
// })

// export default  pool


import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER,        
  host: process.env.DB_HOST,      
  database: process.env.DB_NAME,    
  password: process.env.DB_PASS,   
  port: process.env.DB_PORT || 5432,
   ssl: isProduction
    ? { rejectUnauthorized: false }  // for Render
    : false   
});

export default pool;