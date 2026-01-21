import connection from "../config/db.js"

//ghi luot truy cap
const saveLog = (req, res) => {
    const { userID, pageURL } = req.body;
    const sql = "INSERT INTO access_logs (userID, pageURL) VALUES (?, ?)";
    connection.query(sql, [userID || null, pageURL], (err, result) => {
        if(err){
            return res.status(500).json({message: "Lỗi database"});
        }
        res.status(201).json({message: "Đã ghi nhận lượt truy cập"})
    })
}

const getLogStat = (req, res) => {
    const sql = "SELECT COUNT(*) as total FROM access_logs";
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(500).json({message: "Lỗi database"});
        }
        res.status(200).json(result[0]);
    })
}

export default { saveLog, getLogStat };