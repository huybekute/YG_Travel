import connection from "../config/db.js";

const getAllCategories = (req, res) => {
    const sql = "SELECT * FROM blog_categories ORDER BY name ASC";
    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi lấy danh mục" });
        res.status(200).json(result);
    });
};

const getCategoryBySlug = (req, res) => {
    const { slug } = req.params;
    const sql = "SELECT * FROM blog_categories WHERE slug = ?";
    connection.query(sql, [slug], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi database" });
        if (result.length === 0) return res.status(404).json({ message: "Không thấy danh mục" });
        res.status(200).json(result[0]);
    });
};

const createCategory = (req, res) => {
    const { name, slug, description } = req.body;
    const sql = "INSERT INTO blog_categories (name, slug, description) VALUES (?, ?, ?)";
    connection.query(sql, [name, slug, description], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi tạo danh mục" });
        res.status(201).json({ message: "Tạo danh mục thành công" });
    });
};

const deleteCategory = (req, res) => {
    const { id } = req.params;
    const checkSql = "SELECT COUNT(*) as postCount FROM blogs WHERE categoryID = ?";
    connection.query(checkSql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi kiểm tra dữ liệu" });
        const postCount = result[0].postCount;
        if (postCount > 0) {
            return res.status(400).json({ 
                message: `Không thể xóa! Danh mục này đang có ${postCount} bài viết. Hãy xóa hoặc chuyển bài viết sang mục khác trước.` 
            });
        }
        const deleteSql = "DELETE FROM blog_categories WHERE categoryID = ?";
        connection.query(deleteSql, [id], (err, result) => {
            if (err) return res.status(500).json({ message: "Lỗi khi xóa danh mục" });
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy danh mục để xóa" });
            }
            res.status(200).json({ message: "Xóa danh mục thành công" });
        });
    });
};

// dem so luong bai viet theo danh muc
const getBlogCategories = (req, res) => {
    const sql = `
        SELECT 
            c.categoryID, 
            c.name, 
            c.slug, 
            c.description,
            COUNT(p.postID) as postCount
        FROM blog_categories c
        LEFT JOIN blogs p ON c.categoryID = p.categoryID AND p.status = 1
        GROUP BY c.categoryID
    `;
    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi lấy danh mục" });
        res.status(200).json(result);
    });
};

export default { getAllCategories, getCategoryBySlug, createCategory, deleteCategory, getBlogCategories };