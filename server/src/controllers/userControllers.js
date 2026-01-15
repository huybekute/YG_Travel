import bcrypt from "bcrypt"
import connection from "../config/db.js"
import jwt from "jsonwebtoken"

//dang ky
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !password || !email){
        return res.status(400).json({message: "Vui lòng điền đầy đủ thông tin"})
    }

    try{
        //ma hoa mk
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        connection.query(sql, [username, email, hashPass], async (err, result) => {
            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({message: "username hoặc email đã tồn tại"});
                }
                return res.status(500).json({message: err.message})
            }
            res.status(201).json({
                message: "Tạo tk thành công",
                userID: result.insertId
            });
        })

    }
    catch(err){
        return res.status(500).json({message: "Lỗi máy chủ"})
    }
}

//tao user bang admin
const createUser = async (req, res) => {
    const {username, email, password, role } = req.body;
    if(!username || !email || !password ) {
        return res.status(400).json({message : "Vui lòng điền đầy đủ thông tin"});
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        const userRole = role || "user";
        const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ? ,?)";
        connection.query(sql, [username, email, hashPass, userRole], async (err, result) => {
            if(err) {
                if(err.code === "ER_DUP_ENTRY"){
                    return res.status(500).json("Username hoặc email đã tồn tại");
                }
                return res.status(500).json({ message: "Lỗi DB: "})
            }
            res.status(200).json({
                message: "Tạo tk thành công",
                userID : result.insertId,
                role: result.role
            });
        })
    }
    catch (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
    }
}

//dang nhap
const login = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({message: "Vui lòng nhập đầy đủ thông tin"})
    }
    try{
        const sql = "SELECT * FROM users WHERE username = ? OR email = ?"
        connection.query(sql, [username, username], async (err, result) => {
            if(err) return res.status(500).json({message: "Lỗi db"})

            if(result.length === 0) return res.status(404).json({message: "username ko tồn tại"});

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({message: "Sai mật khẩu"});

            //tao token
            const token = jwt.sign(
                { id: user.userID, role: user.role },
                process.env.TOKEN,
                { expiresIn: "1h" }
            )

            res.status(200).json({
                message: "Đăng nhập thành công",
                token: token,
                user : {
                    userID: user.userID,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });

    }
    catch(err){
        return res.status(500).json({message: "Lỗi máy chủ"})
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT userID, username, email, fullname, phoneNumber, address, created_at, updated_at FROM users WHERE userID = ?";
    connection.query(sql, [id], async (err, result) => {
        if(err) return res.status(500).json({message: "Lỗi DB"});
        if(result.length === 0) return res.status(404).json({message: "Không tìm thấy user với id này"});
        res.status(200).json(result[0])
    });
}

const updateUser = async (req, res) => {
    const {id } = req.params;
    const { fullname, phoneNumber, address } = req.body;
    const sql = "UPDATE users SET fullname = ?, phoneNumber = ?, address = ? WHERE userID = ?"
    connection.query(sql, [fullname, phoneNumber, address, id], async (err, result) => {
        if(err) return res.status(500).json({message: "Lỗi cập nhật"});
        if(result.affectedRows === 0) return res.status(404).json({message: "Cập nhật không thành công"});
        res.status(200).json({message: "Cập nhật thông tin thành công"})
    })
}

const getAllUsers = async (req, res) => {
    const sql = "SELECT userID, username, email, fullname, phoneNumber, address, created_at, updated_at FROM users";
    connection.query(sql, (err, result) => {
        if(err) return res.status(500).json({message:"Lỗi truy vấn"});
        res.status(200).json(result);
    })
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE userID = ?";
    connection.query(sql, [id], async (err, result) => { 
        if(err){
            if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                return res.status(409).json({message : "Không thể người dùng này vì họ có các mục yêu thích, hãy clear trước"})
            }
            return res.status(500).json({message: "Lỗi xóa"});
        }
        if(result.affectedRows === 0) return res.status(404).json("Không tìm thấy người dùng");
        res.status(200).json({message: "Xóa user thành công"});
    })
}

export default {signup, login, createUser, getUser, updateUser, getAllUsers, deleteUser};


