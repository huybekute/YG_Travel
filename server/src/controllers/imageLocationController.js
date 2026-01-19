import connection from "../config/db.js"

//thêm anh
const addImage = (req, res) => {
    let { locationID, imageURL, description } = req.body;
    if( !imageURL || !locationID){
        return res.status(400).json({message : "Vui lòng nhập đầy đủ thông tin"})
    }

    const sql = "INSERT INTO image_locations (locationID, imageURL, description ) VALUES (?, ?, ?)";
    connection.query(sql, [locationID, imageURL, description], (err, result) => {
        if(err){
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: "ID địa điểm không tồn tại" });
            }
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({message : "Ảnh đã tồn tại"});
            }
            return res.status(500).json({message : "Lỗi DB"});
        }
        res.status(201).json({
            message : "Thêm ảnh thành công",
            imageID: result.insertId
        })
    })
}

// xoa ảnh

const deleteImage = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM image_locations WHERE imageID = ?"
    connection.query(sql, [id], (err, result) => {
        if(err) {
            if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                return res.status(409).json({message : "Không thể xóa vì đang là khóa ngoại"});
            }
            return res.status(500).json({message : "Lỗi xóa"});
        }
        if(result.affectedRows === 0) return res.status(404).json({message : "Không tìm thấy ảnh"});
        return res.status(200).json({message : "Xóa ảnh thành công"})
    })
}


//lay anh
const getImage = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM image_locations WHERE imageID = ?";
    connection.query(sql, [id], (err, result) => {
        if(err){
            return res.status(500).json({message : "Lỗi truy vấn"});
        } 
        if(result.length === 0){
            return res.status(404).json({message : "Không tìm thấy ảnh với id này"});
        }
        return res.status(200).json(result[0]);
    })
}

//lay tat ca ảnh

const getAllImages = (req, res) => {
    const sql = "SELECT * FROM image_locations"
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        return res.status(200).json(result)
    })
}

//cap nhat ảnh
const updateImage = (req, res) => {
    const { id } = req.params;
    const { locationID, imageURL, description } = req.body;
    if (!imageURL || !imageURL.trim() || !locationID) {
        return res.status(400).json({message: "URL không được trống"});
    }
    const sql = "UPDATE image_locations SET locationID = ? , imageURL = ?, description = ? WHERE imageID = ?";
    connection.query(sql, [locationID, imageURL, description, id], (err, result) => {
        if(err){
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: "ID địa điểm không tồn tại" });
            }
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({message: "Ảnh đã tồn tại"});
            }
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({message : "Không tìm thấy ảnh với id này"});
        }
        return res.status(200).json({message : "Cập nhật thành công"});
    })
}

//lay ds anh cua 1 location
const getImageByLocation = (req, res) => {
    const { locationID } = req.params;
    const sql = "SELECT * FROM image_locations WHERE locationID = ?";
    connection.query(sql, [locationID], (err, result) => {
        if(err) {
            return res.status(500).json({message: "Lỗi truy vấn"});
        }
        return res.status(200).json(result)
    })
}

export default { addImage, deleteImage, getImage, getAllImages, updateImage, getImageByLocation};