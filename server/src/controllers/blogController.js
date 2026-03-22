import connection from "../config/db.js";
import cloudinary from "../config/cloudinary.js"
const getBlogs = (req, res) => {
    const { category } = req.query;
    let sql = `
        SELECT p.postID, p.title, p.slug, p.thumbnail, p.excerpt, p.views, p.createdAt, 
               c.name as categoryName, u.fullName as authorName
        FROM blogs p
        LEFT JOIN blog_categories c ON p.categoryID = c.categoryID
        LEFT JOIN users u ON p.userID = u.userID
        WHERE p.status = 1
    `;
    const params = [];
    if (category) {
        sql += " AND c.slug = ?";
        params.push(category);
    }
    sql += " ORDER BY p.createdAt DESC";
    connection.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi database" });
        res.status(200).json(result);
    });
};

const getBlogDetail = (req, res) => {
    const { slug } = req.params;
    const sql = `
        SELECT p.*, 
               c.name as categoryName, 
               c.slug as categorySlug, 
               u.fullName as authorName, 
               l.name as locationName
        FROM blogs p
        LEFT JOIN blog_categories c ON p.categoryID = c.categoryID 
        LEFT JOIN users u ON p.userID = u.userID           
        LEFT JOIN locations l ON p.locationID = l.locationID
        WHERE p.slug = ? AND p.status = 1
    `;
    connection.query(sql, [slug], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi database" });
        if (result.length === 0) return res.status(404).json({ message: "Không tìm thấy bài viết" });
        connection.query("UPDATE blogs SET views = views + 1 WHERE slug = ?", [slug]);
        res.status(200).json(result[0]);
    });
};

const createBlog = (req, res) => {
    const { title, slug, excerpt, content, categoryID, userID, locationID } = req.body;
    const file = req.file; 
    const savePostToDB = (imageUrl) => {
        const sql = `
            INSERT INTO blogs (title, slug, thumbnail, excerpt, content, categoryID, userID, locationID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [title, slug, imageUrl || null, excerpt, content, categoryID, userID, locationID || null];
        connection.query(sql, params, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Slug đã tồn tại" });
                return res.status(500).json({ message: "Lỗi lưu Database", err });
            }
            res.status(201).json({ message: "Tạo bài viết thành công", postID: result.insertId, thumbnail: imageUrl });
        });
    };
    if (file) {
        cloudinary.uploader.upload_stream(
            { 
                folder: 'blog_thumbnails',
                upload_preset: 'YG_Travel_Preset' 
            }, 
            (error, result) => {
                if (error) {
                    console.error("Lỗi upload ảnh Cloudinary:", error);
                    return res.status(500).json({ message: "Lỗi upload ảnh lên Cloud" });
                }
                savePostToDB(result.secure_url);
            }
        ).end(file.buffer);
    } else {
        savePostToDB(null);
    }
};

const updateBlog = (req, res) => {
    const { id } = req.params;
    const { title, slug, thumbnail, excerpt, content, categoryID, locationID, status } = req.body;
    const file = req.file; 
    const updatePostInDB = (imageUrl) => {
        const sql = `
            UPDATE blogs 
            SET title = ?, slug = ?, thumbnail = ?, excerpt = ?, content = ?, 
                categoryID = ?, locationID = ?, status = ?
            WHERE postID = ?
        `;
        const finalImageUrl = (imageUrl !== undefined) ? imageUrl : thumbnail;
        
        const params = [title, slug, finalImageUrl, excerpt, content, categoryID, locationID || null, status, id];
        
        connection.query(sql, params, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Slug đã tồn tại" });
                return res.status(500).json({ message: "Lỗi database khi cập nhật", err });
            }
            if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy bài viết" });
            res.status(200).json({ message: "Cập nhật bài viết thành công", thumbnail: finalImageUrl });
        });
    };
    if (file) {
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: 'blog_thumbnails',
                upload_preset: 'YG_Travel_Preset' 
            }, 
            (error, result) => {
                if (error) {
                    console.error("Lỗi upload ảnh Cloudinary:", error);
                    return res.status(500).json({ message: "Lỗi upload ảnh lên Cloud" });
                }
                updatePostInDB(result.secure_url); 
            }
        );
        stream.end(file.buffer);
    } else {
        updatePostInDB(undefined); 
    }
};

const deleteBlog = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM blogs WHERE postID = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi xóa bài viết" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy bài viết" });
        res.status(200).json({ message: "Đã xóa bài viết thành công" });
    });
};

const getBlogForAdmin = (req, res) => {
    const sql = `
        SELECT p.postID, p.title, p.slug, p.thumbnail, p.excerpt, p.content, p.views, p.status, p.createdAt, p.categoryID,
        c.name as categoryName, u.fullName as authorName
        FROM blogs p LEFT JOIN blog_categories c ON p.categoryID = c.categoryID
        LEFT JOIN users u ON p.userID = u.userID
        ORDER BY p.createdAt DESC`
    
    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi database khi lấy dữ liệu Admin" });
        res.status(200).json(result);
    });
};

const updateBlogStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE blogs SET status = ? WHERE postID = ?";
    connection.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy bài viết" });
        res.status(200).json({ 
            message: status === 1 ? "Đã hiển thị bài viết" : "Đã ẩn bài viết thành công" 
        });
    });
};


export default { getBlogs, getBlogDetail, createBlog, updateBlog, deleteBlog, getBlogForAdmin, updateBlogStatus}