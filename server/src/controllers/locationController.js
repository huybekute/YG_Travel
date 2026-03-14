import connection from "../config/db.js"

// them dia diem
const addLocation = (req, res) => {
    let { locationName, provinceID, categoryID, description } = req.body;
    if( !locationName  || !locationName.trim() ){
        return res.status(400).json({message : "Vui lòng nhập đầy đủ thông tin"})
    }

    locationName = locationName.trim();

    const sql = "INSERT INTO locations (name, provinceID, categoryID, description ) VALUES (?, ?, ?, ?)";
    connection.query(sql, [locationName, provinceID, categoryID, description], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({message : "Địa điểm đã tồn tại"});
            }
            return res.status(500).json({message : "Lỗi DB"});
        }
        res.status(201).json({
            message : "Thêm địa điểm thành công",
            locationID: result.insertId
        })
    })
}

// xoa dia diem

const deleteLocation = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM locations WHERE locationID = ?"
    connection.query(sql, [id], (err, result) => {
        if(err) {
            if(err.code === 'ER_ROW_IS_REFERENCED_2'){
                return res.status(409).json({message : "Không thể xóa vì đang là khóa ngoại"});
            }
            return res.status(500).json({message : "Lỗi xóa"});
        }
        if(result.affectedRows === 0) return res.status(404).json({message : "Không tìm thấy địa điểm"});
        return res.status(200).json({message : "Xóa địa điểm thành công"})
    })
}


//lay dia diem
const getLocation = (req, res) => {
    const { id } = req.params;
    // const sql = "SELECT * FROM locations WHERE locationID = ?";
    const sql = `
        SELECT 
            L.*, 
            P.name AS provinceName, 
            C.name AS categoryName,
            (SELECT imageURL FROM image_locations WHERE locationID = L.locationID LIMIT 1) AS avatar
        FROM locations L 
        JOIN provinces P ON L.provinceID = P.provinceID 
        JOIN categories C ON L.categoryID = C.categoryID
        WHERE L.locationID = ?
    `;
    connection.query(sql, [id], (err, result) => {
        if(err){
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        if(result.length === 0){
            return res.status(404).json({message : "Không tìm thấy địa điểm với id này"});
        }
        return res.status(200).json(result[0]);
    })
}

//lay tat ca dia diem

const getAllLocations = (req, res) => {
    // const sql = "SELECT L.locationID, L.name, P.name AS provinceName, C.name AS categoryName, L.description FROM locations L JOIN provinces P ON L.provinceID = P.provinceID JOIN categories C ON L.categoryID = C.categoryID";
    const sql = `
        SELECT 
            L.locationID, 
            L.name, 
            P.name AS provinceName, 
            C.name AS categoryName, 
            L.description,
            (SELECT imageURL FROM image_locations WHERE locationID = L.locationID LIMIT 1) AS avatar,
            ROUND(IFNULL(AVG(R.rating), 0), 1) AS avgRating,
            COUNT(R.reviewID) AS totalReviews
        FROM locations L 
        JOIN provinces P ON L.provinceID = P.provinceID 
        JOIN categories C ON L.categoryID = C.categoryID
        LEFT JOIN reviews R ON L.locationID = R.locationID GROUP BY L.locationID
    `;
    connection.query(sql, (err, result) => {
        if(err){
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        return res.status(200).json(result)
    })
}

//cap nhat dia diem

const updateLocation = (req, res) => {
    const { id } = req.params;
    let { locationName, provinceID, categoryID, description } = req.body;
    if(!locationName || !locationName.trim()){
        return res.status(400).json({message: "Tên địa điểm không được trống"})
    }   
    locationName = locationName.trim()
    const sql = "UPDATE locations SET name = ? , provinceID = ?, categoryID = ?, description = ? WHERE locationID = ?";
    connection.query(sql, [locationName, provinceID, categoryID, description, id], (err, result) => {
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({message: "Địa điểm đã tồn tại"});
            }
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        if(result.affectedRows === 0){
            return res.status(404).json({message : "Không tìm thấy địa điểm với id này"});
        }
        return res.status(200).json({message : "Cập nhật thành công"});
    })
}

//dem so dia diem theo tinh thanh
const countLocationByProvince = (req, res) => {
    const sql = `SELECT p.name AS provinceName, COUNT(l.locationID) AS count FROM provinces p LEFT JOIN locations l 
                ON p.provinceID = l.provinceID GROUP BY p.provinceID, p.name ORDER BY count DESC`

    connection.query(sql, (err, result) => {
        if(err) {
            return res.status(500).json({message: "Lỗi tìm kiếm"})
        }
        res.status(200).json(result)
    })
}

//dem so dia diem theo the loai
const countLocationByCategory = (req, res) => {
    const sql = `SELECT c.name AS categoryName, COUNT(l.locationID) AS count FROM categories c 
                LEFT JOIN locations l ON c.categoryID = l.categoryID GROUP BY c.categoryID, c.name`;

    connection.query(sql, (err, result) => {
        if(err) {
            return res.status(500).json({message: "Lỗi tìm kiếm"})
        }
        res.status(200).json(result)
    })
}

//top dia diem duoc yeu thich nhat
const getTopLocation = (req, res) => {
    const sql = `
        SELECT 
            l.name, 
            ROUND(AVG(r.rating), 1) AS avgRating, 
            COUNT(r.reviewID) AS totalReviews 
        FROM locations l 
        INNER JOIN reviews r ON l.locationID = r.locationID 
        WHERE r.status = 1
        GROUP BY l.locationID, l.name 
        ORDER BY avgRating DESC, totalReviews DESC 
        LIMIT 5`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi lấy top địa điểm" });
        }
        res.status(200).json(result);
    });
}

export default { addLocation, deleteLocation, getLocation, getAllLocations, updateLocation, countLocationByProvince, countLocationByCategory, getTopLocation };