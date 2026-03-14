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
            console.error("Lỗi SQL:", err);
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
        WHERE r.locationID = ?
        ORDER BY r.createdAt DESC`;
    connection.query(sql, [locationID], (err, result) => {
        if (err) {
            console.error("Lỗi SQL:", err.sqlMessage);
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

export default { saveReview, getReviewsByLocation, statReview };