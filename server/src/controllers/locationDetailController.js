import connection from "../config/db.js";

const getDetailsByLocation = (req, res) => {
        const { locationID } = req.params;
        const sql = "SELECT * FROM location_details WHERE locationID = ? ORDER BY id ASC";
        connection.query(sql, [locationID], (err, results) => {
            if (err) {
                console.error("Lỗi lấy chi tiết:", err);
                return res.status(500).json({ message: "Lỗi hệ thống khi lấy chi tiết" });
            }
            return res.status(200).json(results);
        });
    }

const addLocationDetail = (req, res) => {
    const { locationID, section, content } = req.body;

    if (!locationID || !section || !content) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }
    const sql = "INSERT INTO location_details (locationID, section, content) VALUES (?, ?, ?)";
    connection.query(sql, [locationID, section, content], (err, result) => {
        if (err) {
            console.error("Lỗi thêm chi tiết:", err);
            return res.status(500).json({ message: "Lỗi khi thêm chi tiết" });
        }
        return res.status(201).json({ 
            message: "Thêm chi tiết thành công", 
            detailId: result.insertId 
        });
    });
}

const deleteLocationDetail = (req, res) => {
    const { id } = req.params; 

    const sql = "DELETE FROM location_details WHERE id = ?";
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Lỗi xóa chi tiết:", err);
            return res.status(500).json({ message: "Lỗi hệ thống khi xóa" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy mục để xóa" });
        }
        return res.status(200).json({ message: "Đã xóa mục chi tiết thành công!" });
    });
};

export default { getDetailsByLocation, addLocationDetail, deleteLocationDetail}