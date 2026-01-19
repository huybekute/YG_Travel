import connection from "../config/db.js";

// them tinh
const addProvince = (req, res) => {
    let { provinceName, description } = req.body;

    if(!provinceName || !provinceName.trim()){
        return res.status(400).json({message : "Vui lòng nhập đầy đủ thông tin"});
    }

    provinceName = provinceName.trim();
    const sql = "INSERT INTO provinces (name, description) VALUES (?, ?)";
    connection.query(sql, [provinceName, description], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({message : "Tỉnh đã tồn tại"})
            }
            return res.status(500).json({message : "Lỗi DB"})
        }
        res.status(201).json({
            message : "Thêm tỉnh thành công",
            provinceID : result.insertId
        })
    })
}

// xoa tinh
const deleteProvince = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM provinces WHERE provinceID = ?";
    connection.query(sql, [id], (err, result) => {
        if(err){
            if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                return res.status(409).json({message : "Không thể xóa vì đang là khóa ngoại"})
            }
            return res.status(500).json({message : "Lỗi xóa"});
        }
        if(result.affectedRows === 0) return res.status(404).json({message : "Không tìm thấy tỉnh"});
        res.status(200).json({message: "Xóa tỉnh thành công"})
    })
}

// lay tinh
const getProvince = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM provinces WHERE provinceID = ?";
    connection.query(sql, [id], (err, result) => {
        if(err) {
            return res.status(500).json({message:"Lỗi truy vấn"})
        }
        if(result.length === 0) {
            return res.status(404).json({message : "Không tìm thấy tỉnh với ID này"});
        }
        res.status(200).json(result[0]);
    });
}

//lay ds tinh

const getAllProvinces = (req, res) => {
    const sql = "SELECT * FROM provinces ORDER BY name ASC";
    connection.query(sql, (err, result) => {
        if(err) {
            return res.status(500).json({message: "Lỗi truy vấn"})
        }
        return res.status(200).json(result);
    })
}

//cap nhat tinh

const updateProvince = (req, res) => {
    const { id } = req.params;
    let { name, description } = req.body;
    if(!name || !name.trim()){
        return res.status(400).json({message: "Tên tỉnh không được trống"})
    }
    name = name.trim()

    const sql = "UPDATE provinces SET name = ?, description = ? WHERE provinceID = ?"
    connection.query(sql, [name, description, id], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({message : "Tỉnh đã tồn tại"})
            }
            return res.status(500).json({message: "Lỗi truy vấn"})
        }
        if(result.affectedRows === 0) return res.status(404).json({message : "Không tìm thấy tỉnh với ID này"});
        res.status(200).json({message: "Cập nhật thành công"})
    })
}

export default { addProvince, deleteProvince, getProvince, getAllProvinces, updateProvince};