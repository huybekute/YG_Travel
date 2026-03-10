import multer from 'multer';

// giu file anh trong RAM
const storage = multer.memoryStorage();

// chi duoc upload file anh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ được upload file ảnh'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // toi da 5mb
});

export default upload;