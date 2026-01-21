import connection from "../config/db.js"

// lay tong so luot yeu thich
const getAllFavorite = (req, res) => {
    const sql = "SELECT COUNT(*) as total FROM favorite_lists";
    connection.query(sql, (err, result) => {
        if(err){
            
            return res.status(500).json({message: "Lỗi db" + err.sqlMessage});
        }
        return res.status(200).json(result[0])
    })
}

export default { getAllFavorite }   