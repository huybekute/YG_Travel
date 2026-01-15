import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({message : "Chưa đăng nhập"})
    }

    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
        if(err) return res.status(403).json({message : "Token không hợp lệ hoặc hết hạn"});
        req.user = decoded;
        next();
    });
}

export default verifyToken;