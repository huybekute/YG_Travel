import connection from "../config/db.js";

const sendContact = (req, res) => {
    const { fullName, phone, email, message } = req.body;
    if (!fullName || !email || !message) {
        return res.status(400).json({ message: "Vui lòng điền đủ thông tin" });
    }
    const sql = "INSERT INTO contacts (fullName, phone, email, message) VALUES (?, ?, ?, ?)";
    connection.query(sql, [fullName, phone, email, message], (err, result) => {
        if (err) {
            console.error("Lỗi MySQL:", err);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
        return res.status(201).json({ message: "Gửi thông tin liên hệ thành công" });
    });
};

const getAllContacts = (req, res) => {
    const sql = `
        SELECT * FROM contacts 
        ORDER BY FIELD(status, 'pending', 'processed') ASC, createdAt DESC
    `;
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
        return res.status(200).json(results);
    });
};

const updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    const validStatuses = ['pending', 'processed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const sql = "UPDATE contacts SET status = ? WHERE contactID = ?";
    connection.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
        return res.status(200).json({ message: "Đã cập nhật trạng thái" });
    });
};

const deleteContact = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM contacts WHERE contactID = ?";
    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi hệ thống" });
        return res.status(200).json({ message: "Đã xóa liên hệ thành công" });
    });
};

export default { sendContact, getAllContacts, updateStatus, deleteContact };