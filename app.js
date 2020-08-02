const express = require("express");
const path = require('path');
const morgan = require("morgan");
const mysql = require("mysql");
const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// environmental path
dotenv.config({ path: './.env'})

const app = express()

//Middleware
app.use(morgan('dev'))

const db = require("./config/db.config"); //changed name of sequelize to db update:again changed to sequelize again to db :P
// db.sequelize.sync();


app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Routes
// http://localhost:3000/users

app.use('/users', require('./routes/users'))

//Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})
