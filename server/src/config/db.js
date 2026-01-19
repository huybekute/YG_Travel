import dotenv from "dotenv"
import mysql from "mysql2"

dotenv.config()

console.log("DB:", process.env.name);
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.NAME
});

connection.connect( (err) => {
    if(err){
        console.log('Error' + err.stack)
    }
    else{
        console.log('Connected ' + connection.threadId)
    }
})

export default connection;