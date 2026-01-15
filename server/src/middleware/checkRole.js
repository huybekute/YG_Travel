//kiem tra quyen admin

const checkRole = (role) => {
    return (req, res, next) => {
        if(!req.user || req.user.role !== role) {
            return res.status(403).json({message: "Bạn không có quyền truy cập"});
        }
        next();
    }
}

export default checkRole;