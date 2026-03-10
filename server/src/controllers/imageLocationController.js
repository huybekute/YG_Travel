import connection from "../config/db.js"
import cloudinary from "../config/cloudinary.js";
//thêm anh
const addImage = (req, res) => {
    const { locationID, description } = req.body;
    const files = req.files; 

    if (!files || files.length === 0 || !locationID) {
        return res.status(400).json({ message: "Vui lòng chọn ít nhất 1 ảnh và địa điểm!" });
    }

    const uploadedImages = [];
    let uploadCount = 0;
    // duyet qua tung tam de upload
    files.forEach((file) => {
        cloudinary.uploader.upload_stream(
            { 
                folder: 'locations',
                upload_preset: 'YG_Travel_Preset' 
            }, 
            (error, result) => {
                uploadCount++;

                if (error) {
                    console.error("Lỗi upload 1 hinh", error);
                } else {
                    uploadedImages.push([locationID, result.secure_url, description]);
                }
                if (uploadCount === files.length) {
                    if (uploadedImages.length === 0) {
                        return res.status(500).json({ message: "Không có ảnh nào upload thành công!" });
                    }
                    const sql = "INSERT INTO image_locations (locationID, imageURL, description) VALUES ?";
                    connection.query(sql, [uploadedImages], (err, dbResult) => {
                        if (err) {
                            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                                return res.status(400).json({ message: "ID địa điểm không tồn tại" });
                            }
                            return res.status(500).json({ message: "Lỗi lưu Database", err });
                        }

                        res.status(201).json({
                            message: `Thêm thành công ${uploadedImages.length} ảnh!`,
                            count: uploadedImages.length
                        });
                    });
                }
            }
        ).end(file.buffer);
    });
};

// xoa ảnh

const deleteImage = (req, res) => {
    const { id } = req.params;
    const findSql = "SELECT imageURL FROM image_locations WHERE imageID = ?";
    connection.query(findSql, [id], async (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ message: "Không tìm thấy ảnh" });

        const imageUrl = result[0].imageURL;
        
        // lay publicid va url
        const parts = imageUrl.split('/');
        const folderAndFile = parts[parts.length - 2] + '/' + parts[parts.length - 1].split('.')[0];

        try {
            //xoa tren cloud
            await cloudinary.uploader.destroy(folderAndFile);
            
            // 3. Xóa trong Database
            const sql = "DELETE FROM image_locations WHERE imageID = ?";
            connection.query(sql, [id], (err) => {
                if (err) return res.status(500).json({ message: "Lỗi xóa DB" });
                return res.status(200).json({ message: "Xóa sạch cả DB và Cloud!" });
            });
        } catch (cloudErr) {
            return res.status(500).json({ message: "Lỗi khi gọi lên Cloudinary" });
        }
    });
};


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
    const sql = "SELECT * FROM image_locations ORDER BY imageID DESC"
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
    
    if (!imageURL || !locationID) {
        return res.status(400).json({message: "Thông tin không được trống"});
    }
    
    const sql = "UPDATE image_locations SET locationID = ? , imageURL = ?, description = ? WHERE imageID = ?";
    connection.query(sql, [locationID, imageURL, description, id], (err, result) => {
        if(err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ message: "ID địa điểm không tồn tại" });
            return res.status(500).json({message : "Lỗi truy vấn"});
        }
        if(result.affectedRows === 0) return res.status(404).json({message : "Không tìm thấy ảnh"});
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