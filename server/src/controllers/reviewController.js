import connection from "../config/db.js";

const saveReview = (req, res) => {
    const { locationID, rating, comment = null } = req.body;
    const userID = req.user?.id; 

    if (!userID) {
        return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
    }
    if (!locationID || !rating) {
        return res.status(400).json({ message: "Thiếu dữ liệu (ID hoặc Rating)" });
    }
    const sql = "INSERT INTO reviews (locationID, userID, rating, comment, createdAt) VALUES (?, ?, ?, ?, NOW())";
    connection.query(sql, [locationID, userID, rating, comment], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi lưu đánh giá" });
        }
        res.status(201).json({ message: "Đánh giá thành công!" });
    });
};

const getReviewsByLocation = (req, res) => {
    const locationID = req.params.id; 
    const sql = `
        SELECT r.*, u.fullname
        FROM reviews r 
        JOIN users u ON r.userID = u.userID 
        WHERE r.locationID = ? AND r.status = 1
        ORDER BY r.createdAt DESC`;
    connection.query(sql, [locationID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi database" });
        }
        res.status(200).json(result);
    });
};

const getReviewsByLocationForAdmin = (req, res) => {
    const locationID = req.params.id; 
    const sql = `
        SELECT r.*, u.fullname
        FROM reviews r 
        JOIN users u ON r.userID = u.userID 
        WHERE r.locationID = ?
        ORDER BY r.createdAt DESC`;
    connection.query(sql, [locationID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi database" });
        }
        res.status(200).json(result);
    });
};


const statReview = (req, res) => {
    const sql = "SELECT COUNT(*) as total FROM reviews";
    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi database" });
        res.status(200).json(result[0]);
    });
};


const updateStatusReview = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = "UPDATE reviews SET status = ? WHERE reviewID = ?";
    connection.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
        res.status(200).json({ message: "Cập nhật thành công!" });
    });
};

const deleteReview = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM reviews WHERE reviewID = ?";
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi database" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy đánh giá để xóa" });
        }
        res.status(200).json({ message: "Xóa đánh giá thành công!" });
    });
};

export default { saveReview, getReviewsByLocation, statReview, updateStatusReview, getReviewsByLocationForAdmin, deleteReview};