import bcrypt from "bcrypt"
import connection from "../config/db.js"
import dotenv from "dotenv"

dotenv.config();

const createRootAccount = async () => {
    const sqlExist = "SELECT * FROM users WHERE email = ? OR username = ?";
    const email = "admin@gmail.com";
    const username = "admin";
    connection.query(sqlExist, [email, username], async (err, result) => {
        if(err) return;
        if(result.length > 0) {
            return;
        }
        const hassPass = await bcrypt.hash("admin1234", 10);
        const rootAccount = {
            username: 'admin',
            password: hassPass,
            email: 'admin@gmail.com',
            role: 'admin',
            fullName: 'Nguyễn Văn Hoàng Huy',
            phoneNumber: '0393244131',
            address: '216 Tầm Vu, Tân An'
        };

        const sqlInsert = "INSERT INTO users(username, password, email, role, fullName, phoneNumber, address) VALUES (?, ?, ?, ?, ?, ?, ?)";

        connection.query(sqlInsert, [rootAccount.username, rootAccount.password, rootAccount.email, rootAccount.role, 
            rootAccount.fullName, rootAccount.phoneNumber, rootAccount.address]);
        console.log("Tạo tk root thành công");
    })


}
export default createRootAccount;