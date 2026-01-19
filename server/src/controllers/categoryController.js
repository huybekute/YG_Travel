import connection from "../config/db.js"

// them loai
const addCategory = (req, res) => {
    let { categoryName, description } = req.body;
    if( !categoryName  || !categoryName.trim() ){
        return res.status(400).json({message : "Vui lòng nhập đầy đủ thông tín"})
    }

    categoryName = categoryName.trim();

    const sql = "INSERT INTO categories (name, description ) VALUES (?, ?)";
    connection.query(sql, [categoryName, description], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({message : "Loại đã tồn tại"});
            }
            return res.status(500).json({message : "Lỗi DB"});
        }
        res.status(201).json({
            message : "Thêm loại thành công",
            categoryID: result.insertId
        })
    })
}

// xoa loai

const deleteCategory = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM categories WHERE categoryID = ?"
    connection.query(sql, [id], (err, result) => {
        if(err) {
            if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                return res.status(409).json({message : "Không thể xóa vì đang là khóa ngoại"});
            }
            return res.status(500).json({message : "Lỗi xóa"});
        }
        if(result.affectedRows === 0) return res.status(404).json({message : "Không tìm thấy loại"});
        return res.status(200).json({message : "Xóa loại thành công"})
    })
}


//lay the loai
const getCategory = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM categories WHERE categoryID = ?";
    connection.query(sql, [id], (err, result) => {
        if(err){
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        if(result.length === 0){
            return res.status(404).json({message : "Không tìm thấy loại với id này"});
        }
        return res.status(200).json(result[0]);
    })
}

//lay tat ca loai

const getAllCategories = (req, res) => {
    const sql = "SELECT * FROM categories";
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        return res.status(200).json(result)
    })
}

//cap nhat loai

const updateCategory = (req, res) => {
    const { id } = req.params;
    let { name, description } = req.body;
    if(!name || !name.trim()){
        return res.status(400).json({message: "Tên loại không được trống"})
    }
    name = name.trim()
    const sql = "UPDATE categories SET name = ? , description = ? WHERE categoryID = ?";
    connection.query(sql, [name, description, id], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({message: "Loại đã tồn tại"});
            }
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({message : "Không tìm thấy loại với id này"});
        }
        return res.status(200).json({message : "Cập nhật thành công"});
    })
}

export default { addCategory, deleteCategory, getCategory, getAllCategories, updateCategory };